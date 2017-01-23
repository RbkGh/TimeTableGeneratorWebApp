import {FormControl} from "@angular/forms";
/**
 * use this to hold a formControl with it's name so that when adding control
 * to formgroup,we can retrieve the control name from this same object.
 * eg. FormGroup.addControl(formControlName:string,formControl:FormControl)
 */
export class FormControlWithExtraInfoEntity {
  constructor(public formControlName: string,public formControlLabelYearNo:number,public formControl: FormControl) {
  }
}
