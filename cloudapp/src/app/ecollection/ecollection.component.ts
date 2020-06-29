import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators } from '@angular/forms';
import { FormGroupUtil } from '@exlibris/exl-cloudapp-angular-lib';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ECollection } from '../models/ecollection';
import { OptionsService } from '../services/options.service';
import { Options } from '../models/options';
import { MatSelectChange } from '@angular/material/select'
import { forkJoin } from 'rxjs';
import { EcollectionService } from '../services/ecollection.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ecollection',
  templateUrl: './ecollection.component.html',
  styleUrls: ['./ecollection.component.scss']
})
export class EcollectionComponent implements OnInit {
  loading = false;
  percentage = -1;
  form: FormGroup;
  options: Options;
  actions = {};
  ids: string[];
  results: any;

  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe, 
    private ecollectionService: EcollectionService,
    private toastr: ToastrService,
    private optionsService: OptionsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.ids = this.route.snapshot.params['ids'].split(',');
    this.loading = true;
    this.optionsService.options.pipe(
      finalize(() => this.loading = false)
    )
    .subscribe({
      next: results => {
        this.options = results;
        this.form = FormGroupUtil.toFormGroup(new ECollection);
        for (let control in this.form.controls) {
          this.form.controls[control].disable();
        }
      },
      error: e => this.toastr.error('An error occurred: ', e.message)
    });
  }

  toggle(event: MatSelectChange) {
    const fieldName = event.source.trigger.nativeElement.parentElement.dataset.action;
    const field = this.form.get(fieldName);
    this.actions[fieldName] = event.value;
    if ([Actions.NONE, Actions.CLEAR].includes(event.value)) {
      field.setValue('');
      field.disable();
      field.clearValidators();
    } else {
      field.enable();
      field.setValidators(Validators.required);
    }
  }

  update() {
    this.loading = true;
    this.percentage = 0;
    forkJoin(this.ids.map(id=>this.getECollection(id)))
    .pipe(
      map(results=>results.map(ec=>this.mergeECollection(ec))),
      switchMap(targets=>forkJoin(targets.map(target=>this.updateECollection(target)))),
      finalize(()=>setTimeout(()=>{
        this.loading=false; 
        this.percentage = -1
        }, 500)
      )
    )
    .subscribe(results=>{
      console.log('results', results);
      const details = results.map(ec=>
        ec.isError 
        ? { msg: this.translateService.instant('Form.FailureMessage', {id: ec.id, message: ec.message}), success: false } 
        : { msg: this.translateService.instant('Form.SuccessMessage', {id: ec.id}), success: true });
      this.results = {
        successCount: details.filter(d=>d.success).length,
        failureCount: details.filter(d=>!d.success).length,
        details: details
      }
      this.form = null;
    });
  }

  getECollection(id: string) {
    return this.ecollectionService.getECollection(id)
    .pipe(tap(()=>this.percentage += (1/this.ids.length)*50));
  }

  updateECollection(body: any) {
    return this.ecollectionService.updateECollection(body)
    .pipe(tap(()=>this.percentage += (1/this.ids.length)*50));
  }

  mergeECollection(orig: any) {
    let src: ECollection = this.form.getRawValue();
    if (Object.keys(this.actions).length==0) return; // nothing to do
    for (const key of Object.keys(src)) {
      const field = Object.keys(this.actions).find(name=>key==name.split('.')[0]);
      if (!field || this.actions[field] == Actions.NONE) {
        delete src[key];
      } else if (this.actions[field] == Actions.APPEND) {
        src[key] = orig[key] += `; ${src[key]}`;
      }
    }
    if (src.activation_date) {
      src.activation_date = this.datePipe.transform(src.activation_date,'yyyy-MM-dd');
      console.log('date', src.activation_date );
    }
    if (src.expected_activation_date) {
      src.expected_activation_date = this.datePipe.transform(src.expected_activation_date,'yyyy-MM-dd')
    }
    return Object.assign(orig, src);
  }

  get isFormValid(): boolean {
    if (Object.keys(this.actions).length==0) return false; // nothing to do;
    let valid = true;
    for (const [key, value] of Object.entries<Actions>(this.actions)) {
      if ([Actions.APPEND, Actions.REPLACE].includes(value) && 
        !this.form.get(key).value ) {
        valid = false;
        break;
      }
    }
    return valid;
  }
}

enum Actions {
  NONE = 'NONE',
  CLEAR = 'CLEAR',
  REPLACE = 'REPLACE',
  APPEND = 'APPEND'
}
