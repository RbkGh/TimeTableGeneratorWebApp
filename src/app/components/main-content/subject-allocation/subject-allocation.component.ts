import {Component, OnInit, ViewChild, Input} from "@angular/core";
import {SubjectService} from "../../../services/subject.service";
import {SubjectEntity} from "../../../models/subject-entity";
import {SubjectAllocationService} from "../../../services/subject-allocation.service";
import {GeneralResponsePayload} from "../../../models/general-response-payload";
import {Router} from "@angular/router";
import {SubjectAllocationEntity} from "../../../models/subject-allocation-entity";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {ModalComponent} from "ng2-bs3-modal/components/modal";
import {FormControlWithExtraInfoEntity} from "../../../models/form-control-with-extra-info-entity";
import {SubjectsArrayResponsePayload} from "../../../models/subjects-array-response-payload";
import {SubjectEntityWithExtraInfo} from "../../../models/subject-entity-with-extra-info";
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
  subjectsWithExtraInfo: Array<SubjectEntityWithExtraInfo>;
  subjectEntityToBeUpdated: SubjectEntity;
  controlsWithExtraInfoArray: Array<FormControlWithExtraInfoEntity>;
  static FORM_CONTROL_NAME_PREFIX: string = 'formControlYear';

  accessingService: boolean = false;

  formIsValid: boolean = false;
  allocateSubjectPeriodsForm: FormGroup;

  validationMessages: any = {};//magically set all dynamic new propert's with javascript's very very stupid hack,set this when about to open the modal
  formErrors: any = {};//magically set all dynamic new propert's with javascript's very very stupid hack,set this when about to open the modal

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
        let currentFormControlName: string = SubjectAllocationComponent.FORM_CONTROL_NAME_PREFIX + subjectYearGroupsList[i];
        console.log('formControl Name =' + currentFormControlName);
        let currentYearGroupLabel: number = subjectYearGroupsList[i];

        let currentFormControl = new FormControl('', Validators.required);
        controlsWithExtraInfoArray.push(new FormControlWithExtraInfoEntity(currentFormControlName,
          currentYearGroupLabel,
          currentFormControl));
      }

      //equate it to component object after it's been fully built
      this.subjectEntityToBeUpdated = subjectEntityToBeUpdated;
      this.controlsWithExtraInfoArray = controlsWithExtraInfoArray;

      //add all the formControls recursively from the custom Object we built,since it has the formControl name too
      for (let i: number = 0; i < controlsWithExtraInfoArray.length; i++) {
        let currentControlWithName: FormControlWithExtraInfoEntity = controlsWithExtraInfoArray[i];
        this.allocateSubjectPeriodsForm.addControl(currentControlWithName.formControlName, currentControlWithName.formControl);
      }
      this.initFormErrorsAndValidationMessages(subjectYearGroupsList, controlsWithExtraInfoArray);
    }

    this.allocateSubjectPeriodsForm.statusChanges.subscribe(data => {
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
      (response: SubjectsArrayResponsePayload) => {
        console.info(response);
        if (response.status === 0) {

          if (response.responseObject.length > 0) {
            this.calculateNumberOfAllocatedSubjects(response.responseObject);
            //this.subjectAllocationsForSubject = this.getSubjectAllocationsForSubjects(response.responseObject);
            //console.log("SubjectAllocationFor Subject Array ="+this.subjectAllocationsForSubject);
            this.subjectsWithExtraInfo = response.responseObject;
            this.isSubjectsListEmpty = false;
            this.noOfSubjects = this.subjectsWithExtraInfo.length;
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


  calculateNumberOfAllocatedSubjects(subjects: Array<SubjectEntityWithExtraInfo>): Map<string,number> {
    let allocatedSubjects: Array<SubjectEntity> = [];
    let unAllocatedSubjects: Array<SubjectEntity> = [];
    subjects.forEach(
      (subject) => {
        console.info("subject.allSubjectYearGroupsAllocated =" + subject.subjectDoc.allSubjectYearGroupsAllocated);
        if (subject.subjectDoc.allSubjectYearGroupsAllocated) {

          allocatedSubjects.push(subject.subjectDoc);
        } else {
          unAllocatedSubjects.push(subject.subjectDoc);
        }
      });
    this.noOfAllocatedSubjects = allocatedSubjects.length;
    this.noOfUnallocatedSubjects = unAllocatedSubjects.length;
    console.info("AllocatedSubjects =" + this.noOfAllocatedSubjects);
    console.info(" Unallocated=" + this.noOfUnallocatedSubjects);
    let mapOfAllocatedAndUnallocated: Map<string,number> = new Map();
    mapOfAllocatedAndUnallocated.set("ALLOCATED", this.noOfAllocatedSubjects);
    mapOfAllocatedAndUnallocated.set("UNALLOCATED", this.noOfUnallocatedSubjects);
    return mapOfAllocatedAndUnallocated;
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
  initFormErrorsAndValidationMessages(subjectYearGroupsList: Array<number>, controlsWithExtraInfoArray: Array<FormControlWithExtraInfoEntity>): Array<FormControlWithExtraInfoEntity> {

    for (let i = 0; i < subjectYearGroupsList.length; i++) {
      let currentYearGroup: number = subjectYearGroupsList[i];
      controlsWithExtraInfoArray.forEach((formControlWithExtraInfo) => {
        if (currentYearGroup === formControlWithExtraInfo.formControlLabelYearNo) {
          //we can create formControl in formError Object and validationMessage too
          let newPropertyName: string = formControlWithExtraInfo.formControlName;
          this.formErrors[newPropertyName] = '';//set control name empty
          this.validationMessages[newPropertyName] = {
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
    this.accessingService = true;//activate spinner
    console.log("Values =" + JSON.stringify(subjectAllocationForm.value));
    console.log("YearGroupsList  =" + JSON.stringify(this.subjectEntityToBeUpdated.subjectYearGroupList));

    let currentSubjectEntityToBeUpdatedSubjectCode = this.subjectEntityToBeUpdated.subjectCode;
    let subjectAllocationEntityArray: Array<SubjectAllocationEntity> = [];
    for (let i: number = 0; i < this.subjectEntityToBeUpdated.subjectYearGroupList.length; i++) {
      //set id field to null
      let currentSubjAllocationEntity = new SubjectAllocationEntity(null,
        currentSubjectEntityToBeUpdatedSubjectCode,
        +subjectAllocationForm.value[SubjectAllocationComponent.FORM_CONTROL_NAME_PREFIX + this.subjectEntityToBeUpdated.subjectYearGroupList[i]],
        this.subjectEntityToBeUpdated.subjectYearGroupList[i]);
      console.info("Subject entity=" + currentSubjAllocationEntity);
      subjectAllocationEntityArray.push(currentSubjAllocationEntity);
    }

    console.log("Subject Entities to be posted =" + JSON.stringify(subjectAllocationEntityArray));

    this.subjectAllocationService.updateMultipleSubjectAllocation(subjectAllocationEntityArray)
      .subscribe(
        (response: GeneralResponsePayload) => {
          this.accessingService = false;
          console.log("Response status =" + response.status);
          if (response.status === 0) {
            this.modalAllocateSubjectPeriod.dismiss();
            swal("Success", "Subject Periods Allocated Successfully", "success");
            this.getAllSubjectsAndTheirAllocationState();//get all subjectsWithExtraInfo again to update view
          } else {
            swal("Error Occured", "Not all Subjects were allocated.Please Try again now or try again later.", "error");
          }
        },
        (error: any) => {
          this.accessingService = false;
          swal("Error Occured", "Something went wrong.Try Again.", "error");
        }
      );


  }

}
