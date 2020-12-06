import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { FormGroupUtil, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { ECollection, FieldActions, Actions, FormActions } from '../models/ecollection';
import { OptionsService } from '../services/options.service';
import { Options } from '../models/options';
import { MatSelectChange } from '@angular/material/select'
import { forkJoin, iif, of } from 'rxjs';
import { EcollectionService } from '../services/ecollection.service';
import { TranslateService } from '@ngx-translate/core';
import { EService, isEService } from '../models/eservice';

@Component({
  selector: 'app-ecollection',
  templateUrl: './ecollection.component.html',
  styleUrls: ['./ecollection.component.scss']
})
export class EcollectionComponent implements OnInit {
  loading = false;
  percentage = -1;
  form: FormGroup;
  serviceForm: FormGroup;
  options: Options;
  actions: FormActions = {service: {}, collection: {}};
  ids: string[];
  results: Results;

  constructor(
    private route: ActivatedRoute,
    private ecollectionService: EcollectionService,
    private alert: AlertService,
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
        this.form = FormGroupUtil.toFormGroup(new ECollection());
        this.form.setValidators(this.validateForm);
        for (let control in this.form.controls) {
          this.form.controls[control].disable();
        }
        this.serviceForm = FormGroupUtil.toFormGroup(new EService());
        this.serviceForm.setValidators(this.validateForm);
        for (let control in this.serviceForm.controls) {
          this.serviceForm.controls[control].disable();
        }        
      },
      error: e => this.alert.error('An error occurred: ', e.message)
    });
  }

  toggle(event: MatSelectChange, entity: string = 'collection') {
    const fieldName = event.source.trigger.nativeElement.parentElement.dataset.action;
    const form = event.source._parentFormGroup.form;
    const field = form.get(fieldName);
    this.actions[entity][fieldName] = event.value;
    if ([FieldActions.NONE, FieldActions.CLEAR].includes(event.value)) {
      field.setValue(null);
      field.disable();
    } else {
      field.enable();
    }
    form.setErrors(this.validateForm(form));
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
    return this.ecollectionService.get(id)
    .pipe(tap(()=>this.percentage += (1/this.ids.length)*50));
  }

  updateECollection(body: any) {
    /* Update Services */
    return this.ecollectionService.getServices(body.id).pipe(
        map(resp=>resp.electronic_service.map(orig=>this.mergeEService(orig))),
        switchMap(resp=>forkJoin(resp.map(serv=>this.ecollectionService.update(serv)))),
      )
      .pipe(
        switchMap(resp=>iif(() => resp.some(r=>r.isError), of(resp.find(r=>r.isError)), this.ecollectionService.update(body))),
        tap(()=>this.percentage += (1/this.ids.length)*50)
      )
  }

  mergeEService(orig: any) {
    const src: EService = this.serviceForm.getRawValue();
    return this.ecollectionService.merge(orig, src, this.actions.service);
  }

  mergeECollection(orig: any) {
    const src: ECollection = this.form.getRawValue();
    return this.ecollectionService.merge(orig, src, this.actions.collection)
  }

  validateForm = (form: FormGroup): ValidationErrors | null => {
    let errors: ValidationErrors = {};
    const actions = isEService(form.getRawValue()) ? this.actions.service : this.actions.collection;
    if (Object.keys(actions).length==0 ||
      !Object.values(actions).some(v=>v!=FieldActions.NONE)) {
        return {nofields: ''};
    }
    for (const [key, value] of Object.entries<FieldActions>(actions)) {
      if ([FieldActions.APPEND, FieldActions.REPLACE].includes(value) && 
        !form.get(key).value ) {
        if (!errors.missingFields) errors.missingFields=[];
        errors.missingFields.push(key);
      }
    }
    return Object.keys(errors).length>0 ? errors : null;      
  }
}

export interface Results {
  successCount: number;
  failureCount: number;
  details: { msg: string; success: boolean }[];
}