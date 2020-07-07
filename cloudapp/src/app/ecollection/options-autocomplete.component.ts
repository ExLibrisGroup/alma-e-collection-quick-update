import { Component, OnInit, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { Option } from '../models/options';
import { startWith, map } from "rxjs/operators";

@Component({
  selector: 'app-options-autocomplete',
  template: `
  <mat-form-field>
    <input type="text" matInput
    [placeholder]="placeholder"
    [formControl]="control"
    [matAutocomplete]="autocomplete">
    <mat-autocomplete #autocomplete="matAutocomplete" [displayWith]="displayOption">
      <mat-option *ngFor="let option of filteredOptions | async" [value]="option.code">
        {{option.desc}}
      </mat-option>
    </mat-autocomplete>  
  </mat-form-field>  
`
})
export class OptionsAutoCompleteComponent implements OnInit {
  @Input() placeholder: string;
  @Input() control: FormControl;
  @Input() options: Option[];
  filteredOptions: Observable<Option[]>;

  ngOnInit() { 
    this.filteredOptions = this.control.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterOptions(value))
    );   
  }

  private _filterOptions(value: string): Option[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.desc.toLowerCase().includes(filterValue));
  }

  displayOption = (value: string) => {
    const option = this.options.find(o=>o.code === value);
    return option ? option.desc : '';
  }
}