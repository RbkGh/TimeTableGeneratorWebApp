import {Component, OnInit, ViewChild} from "@angular/core";
import {SubjectService} from "../../../services/subject.service";
import {SubjectEntity} from "../../../models/subject-entity";
import {SubjectAllocationService} from "../../../services/subject-allocation.service";
import {GeneralResponsePayload} from "../../../models/general-response-payload";
import {Router} from "@angular/router";
import {SubjectAllocationEntity} from "../../../models/subject-allocation-entity";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {ModalComponent} from "ng2-bs3-modal/components/modal";
import {FormControlWithExtraInfoEntity} from "../../../models/form-control-with-extra-info-entity";
declare var swal: any;
@Component({
  selector: 'app-subject-allocation',
  templateUrl: './subject-allocation.component.html',
  styleUrls: ['./subject-allocation.component.css'],
  providers: [SubjectService, SubjectAllocationService]
})
export class SubjectAllocationComponent implements OnInit {

  @ViewChild('modalAllocateSubjectPeriod')
  modalAllocateSubjectPeriod: ModalComponent;
  noOfSubjects: number;
  isSubjectsListEmpty: boolean = false;
  noOfUnallocatedSubjects: number;
  noOfAllocatedSubjects: number;
  subjects: Array<SubjectEntity>;
  controlsWithExtraInfoArray: Array<FormControlWithExtraInfoEntity>;

  accessingService: boolean = false;

  formIsValid: boolean = false;
  allocateSubjectPeriodsForm: FormGroup;

  validationMessages:any={};//magically set all dynamic new propert's with javascript's very very stupid hack,set this when about to open the modal
  formErrors:any={};//magically set all dynamic new propert's with javascript's very very stupid hack,set this when about to open the modal

  constructor(public subjectAllocationService: SubjectAllocationService, public router: Router) {
  }

  ngOnInit() {
    this.getAllSubjectsAndTheirAllocationState();
    this.buildSubjectAllocationForm();
  }

  buildSubjectAllocationForm(subjectEntityToBeUpdated?: SubjectEntity): void {
    if (typeof subjectEntityToBeUpdated === "undefined") {
      this.allocateSubjectPeriodsForm = new FormGroup({});
    } else {

      this.allocateSubjectPeriodsForm = new FormGroup({});
      let subjectYearGroupsList: Array<number> = subjectEntityToBeUpdated.subjectYearGroupList;
      let controlsWithExtraInfoArray: Array<FormControlWithExtraInfoEntity> = [];
      //loop through yearGroupList to determine number of form control inputs to create
      for (let i: number = 0; i < subjectYearGroupsList.length; i++) {
        let currentFormControlName: string = 'formControlYear' + subjectYearGroupsList[i];
        console.log('formControl Name =' + currentFormControlName);
        let currentYearGroupLabel: number = subjectYearGroupsList[i];

        let currentFormControl = new FormControl('', Validators.required);
        controlsWithExtraInfoArray.push(new FormControlWithExtraInfoEntity(currentFormControlName,
          currentYearGroupLabel,
          currentFormControl));
      }

      //equate it to component object after it's been fully built
      this.controlsWithExtraInfoArray = controlsWithExtraInfoArray;
      //add all the formControls recursively from the custom Object we built,since it has the formControl name too
      for (let i: number = 0; i < controlsWithExtraInfoArray.length; i++) {
        let currentControlWithName: FormControlWithExtraInfoEntity = controlsWithExtraInfoArray[i];
        this.allocateSubjectPeriodsForm.addControl(currentControlWithName.formControlName, currentControlWithName.formControl);
      }
      this.initFormErrorsAndValidationMessages(subjectYearGroupsList,controlsWithExtraInfoArray);
    }

    this.allocateSubjectPeriodsForm.statusChanges.subscribe(data=>{
      console.log(data);
      this.onAllocateSubjectPeriodsFormValueChanged(data);
    });
    this.onAllocateSubjectPeriodsFormValueChanged(); // (re)set validation messages now
  }

  private onAllocateSubjectPeriodsFormValueChanged(data?: any): void {
    if (!this.allocateSubjectPeriodsForm) {
      return;
    }
    const form = this.allocateSubjectPeriodsForm;
    for (const field in this.formErrors) {
      // clear previous error message and styling (if any)
      this.formErrors[field] = '';
      this.formIsValid = false;

      const control = form.get(field);
      //if form is touched,dirty, and if the control is invalid,per validation rule,
      if (control && control.dirty && !control.valid) {

        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
          this.formIsValid = false;
        }
      } else {
        this.formIsValid = true;
      }
    }
  }

  getAllSubjectsAndTheirAllocationState() {
    this.subjectAllocationService.getAllSubjectsAllocationState().subscribe(
      (response: GeneralResponsePayload) => {
        console.info(response);
        if (response.status === 0) {
          this.subjects = response.responseObject;
          if (this.subjects.length > 0) {
            this.calculateNumberOfAllocatedSubjects(this.subjects);
            this.isSubjectsListEmpty = false;
            this.noOfSubjects = this.subjects.length;
          } else {
            this.isSubjectsListEmpty = true;
          }
        } else {
          swal("Error", "Something went wrong,try again.", "error");
        }
      },
      (error: any) => {
        swal("Error", "Ensure you have a working internet connection", "error");
        console.log(error);
      }
    );
  }

  calculateNumberOfAllocatedSubjects(subjects: Array<SubjectEntity>): void {
    let allocatedSubjects: Array<SubjectEntity> = [];
    let unAllocatedSubjects: Array<SubjectEntity> = [];
    subjects.forEach(
      (subject) => {
        if (subject.isAllSubjectYearGroupsAllocated === true) {
          allocatedSubjects.push(subject);
        } else {
          unAllocatedSubjects.push(subject);
        }
      });
    this.noOfAllocatedSubjects = allocatedSubjects.length;
    this.noOfUnallocatedSubjects = unAllocatedSubjects.length;
    console.info('AllocatedSubjects =' + this.noOfAllocatedSubjects + ' Unallocated=' + this.noOfUnallocatedSubjects);
  }

  goToSubjectsPane(): void {
    this.router.navigate([('home/subject')]);
  }

  openSubjectAllocationModal(subjectEntityToBeUpdated: SubjectEntity): void {
    this.buildSubjectAllocationForm(subjectEntityToBeUpdated);
    this.modalAllocateSubjectPeriod.open();


  }

  /**
   * call this after initializing formControls in {@link buildSubjectAllocationForm} to ensure argument passed is never null
   */
  initFormErrorsAndValidationMessages(subjectYearGroupsList:Array<number>,controlsWithExtraInfoArray:Array<FormControlWithExtraInfoEntity>):Array<FormControlWithExtraInfoEntity>{

    for(let i=0;i<subjectYearGroupsList.length;i++) {
      let currentYearGroup:number = subjectYearGroupsList[i];
      controlsWithExtraInfoArray.forEach((formControlWithExtraInfo)=>{
        if(currentYearGroup === formControlWithExtraInfo.formControlLabelYearNo) {
          //we can create formControl in formError Object and validationMessage too
          let newPropertyName:string = formControlWithExtraInfo.formControlName;
          this.formErrors[newPropertyName]='';//set control name empty
          this.validationMessages[newPropertyName]={
            'required': 'Number of periods is required.'
          }
        }
      })
    }

    console.log(this.formErrors);
    console.log(this.validationMessages);
    return controlsWithExtraInfoArray;//just return to make sure everything in this block gets executed b4 program continues
  }

  updateSubjectAllocation(subjectAllocationForm: FormGroup): void {

  }

}
