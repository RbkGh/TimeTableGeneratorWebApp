import {Component, OnInit, ViewChild} from '@angular/core';
import {SubjectService} from "../../../services/subject.service";
import {FormBuilder, FormGroup, Validators, AbstractControl, FormControlName} from "@angular/forms";
import {ModalComponent} from "ng2-bs3-modal/components/modal";
import {SubjectsArrayCustomResponsePayload} from "../../../models/subjects-array-response-payload";
import {SubjectEntity} from "../../../models/subject-entity";
import {GeneralResponsePayload} from "../../../models/general-response-payload";
import {TutorResponsePayload} from "../../../models/TutorResponsePayload";
import {SubjectResponsePayload} from "../../../models/subject-response-payload";

declare var swal: any;
@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css'],
  providers: [SubjectService]
})
export class SubjectComponent implements OnInit {

  @ViewChild('modalAddSubject')
  modalAddSubject: ModalComponent;
  @ViewChild('modalUpdateSubject')
  modalUpdateSubject: ModalComponent;

  addSubjectForm: FormGroup;
  updateSubjectForm: FormGroup;

  subjects: Array<SubjectEntity>;
  currentSubjectBeforeUpdateModalInitiation: SubjectEntity;

  isSubjectsListEmpty: boolean = false;
  formIsValid: boolean = false;
  noOfSubjects: number;
  accessingService: boolean = false;

  constructor(public subjectService: SubjectService,
              public formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getAllSubjects();
    this.buildAddSubjectForm();
    this.buildUpdateSubjectForm();
  }

  refreshPage(): void {
    this.ngOnInit();
  }

  public getAllSubjects(): void {
    this.subjectService.getAllSubjects().subscribe(
      (response: SubjectsArrayCustomResponsePayload) => {
        console.info(response);
        if (response.status === 0) {
          this.subjects = response.responseObject;
          if (this.subjects.length > 0) {
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

  deleteSubject(currentSubjectId: string): void {
    console.log("currentSubjectId=" + currentSubjectId);
    swal({
        title: "Are you sure?",
        text: "This will delete Subject Permanently!!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel please!",
        closeOnConfirm: false,
        closeOnCancel: false,
        showLoaderOnConfirm: true
      },
      (isConfirm) => {
        if (isConfirm) {
          /**
           * always use arrow functions otherwise this collides with typescript's this,hence leading to undefined.
           */
          this.subjectService.deleteSubject(currentSubjectId).subscribe(
            (response: GeneralResponsePayload) => {
              if (response.status === 0) {
                swal("Deleted", "Subject was deleted successfully", "success");
                this.ngOnInit();
              } else {
                swal("Error", "Subject was not deleted,retry", "error");
              }
            }
          );

        } else {
          swal("Cancelled", "Subject was not deleted", "error");
        }
      });


  }

  private buildAddSubjectForm(): void {
    this.addSubjectForm = this.formBuilder.group(
      {
        'subjectFullName': ['',
          Validators.required],
        'subjectCode': ['',
          Validators.required],
        'subjectYearGroupList1': ['',
        ],
        'subjectYearGroupList2': ['',
        ],
        'subjectYearGroupList3': ['',
        ],
        'isSubjectAPracticalSubject': [
          Validators.required],
        'subjectType': [
          Validators.required]
      },
    );

    this.addSubjectForm.valueChanges
      .subscribe(data => this.onAddSubjectFormValueChanged(data));
    this.onAddSubjectFormValueChanged(); // (re)set validation messages now
  }


  private buildUpdateSubjectForm(subject?: SubjectEntity): void {
    /*
     * since form must be initialized in ngOnInit,at that instance,
     * subject will be null or undefined hence the check
     * */
    if (typeof subject === "undefined") {
      this.updateSubjectForm = this.formBuilder.group(
        {
          'subjectFullNameUpdate': ['',
            Validators.required],
          'subjectCodeUpdate': ['',
            Validators.compose([Validators.required])],
          'subjectYearGroupList1Update': ['',
          ],
          'subjectYearGroupList2Update': ['',
          ],
          'subjectYearGroupList3Update': ['',
          ],
          'subjectTypeUpdate': ['',
            Validators.required]
        },
      );
    } else {
      //TODO ADD CUSTOM VALIDATION FOR SUBJECTyEARgROUPlIST,AT LEAST ONE MUST BE PICKED
      let subjectYearGroupList1UpdateValue: boolean;
      let subjectYearGroupList2UpdateValue: boolean;
      let subjectYearGroupList3UpdateValue: boolean;

      if (subject.subjectYearGroupList.indexOf(1) > -1) {
        subjectYearGroupList1UpdateValue = true;
      }
      if (subject.subjectYearGroupList.indexOf(2) > -1) {
        subjectYearGroupList2UpdateValue = true;
      }
      if (subject.subjectYearGroupList.indexOf(3) > -1) {
        subjectYearGroupList3UpdateValue = true;
      }

      this.updateSubjectForm = this.formBuilder.group(
        {
          'subjectFullNameUpdate': [subject.subjectFullName,
            Validators.required],
          'subjectCodeUpdate': [subject.subjectCode,
            Validators.required],
          'subjectYearGroupList1Update': [subjectYearGroupList1UpdateValue || false,
          ],
          'subjectYearGroupList2Update': [subjectYearGroupList2UpdateValue || false,
          ],
          'subjectYearGroupList3Update': [subjectYearGroupList3UpdateValue || false,
          ],
          'subjectTypeUpdate': [subject.subjectType,
            Validators.required]
        },
      );

      this.updateSubjectForm.get('subjectCodeUpdate').markAsDirty();
      this.updateSubjectForm.get('subjectCodeUpdate').markAsTouched();
    }

    this.updateSubjectForm.valueChanges
      .subscribe(data => this.onUpdateSubjectFormValueChanged(data));
    this.onUpdateSubjectFormValueChanged(); // (re)set validation messages now

  }

  private onUpdateSubjectFormValueChanged(data?: any): void {
    if (!this.updateSubjectForm) {
      return;
    }
    const form = this.updateSubjectForm;

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


  formErrors = {
    'subjectFullName': '',
    'subjectCode': '',
    'subjectYearGroupList1': '',
    'subjectYearGroupList2': '',
    'subjectYearGroupList3': '',
    'subjectType': '',
    'subjectFullNameUpdate': '',
    'subjectCodeUpdate': '',
    'subjectYearGroupListUpdate1': '',
    'subjectYearGroupListUpdate2': '',
    'subjectYearGroupListUpdate3': '',
    'subjectTypeUpdate': ''

  };

  formErrorsGetter(): Array<Map<string,string>> {
    let formErrorsArray = new Array<Map<string,string>>();
    let map = new Map<string,string>();
    map.set('subjectFullName', '');
    formErrorsArray.push(map);
    return formErrorsArray;
  }

  validationMessages = {
    'subjectFullName': {
      'required': 'Subject Full name is required.'
    },
    'subjectCode': {
      'required': 'Subject Code is required.'
    },
    'subjectYearGroupList': {
      'required': 'Year groups partaking in subject is required',
    },
    'subjectType': {
      'required': 'Subject Type is required.'
    },
    'subjectFullNameUpdate': {
      'required': 'Subject Full name is required.'
    },
    'subjectCodeUpdate': {
      'required': 'Subject Code is required.'
    },
    'subjectYearGroupListUpdate': {
      'required': 'Year groups partaking in subject is required',
    },
    'subjectTypeUpdate': {
      'requiredUpdate': 'Subject Type is required.'
    }

  };

  private onAddSubjectFormValueChanged(data?: any): void {
    if (!this.addSubjectForm) {
      return;
    }
    const form = this.addSubjectForm;

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
      } else if (control && control.dirty && control.valid) {
        this.formIsValid = true;
      }
    }
  }

  public openAddSubjectModal(): void {
    this.modalAddSubject.open();
  }

  private prepareSubjectJson(addSubjectForm: AbstractControl): SubjectEntity {

    console.log(addSubjectForm);
    let yearGroupsArray: Array<number> = new Array<number>();
    if (addSubjectForm.value.subjectYearGroupList1 === true) {
      yearGroupsArray.push(1);
    }
    if (addSubjectForm.value.subjectYearGroupList2 === true) {
      yearGroupsArray.push(2);
    }
    if (addSubjectForm.value.subjectYearGroupList3 === true) {
      yearGroupsArray.push(3);
    }
    console.log('YearGroupsArray =' + yearGroupsArray);
    //let subjectYearGroupList : Array<number> =
    return new SubjectEntity(null,
      addSubjectForm.value.subjectFullName,
      addSubjectForm.value.subjectCode,
      yearGroupsArray,
      addSubjectForm.value.subjectType,
      addSubjectForm.value.isSubjectAPracticalSubject,
      null);
  }

  private prepareSubjectJsonToUpdate(updateSubjectForm: AbstractControl, currentSubjectObject: SubjectEntity): SubjectEntity {

    console.log(updateSubjectForm);
    let yearGroupsArray: Array<number> = new Array<number>();
    if (updateSubjectForm.value.subjectYearGroupList1Update === true) {
      yearGroupsArray.push(1);
    }
    if (updateSubjectForm.value.subjectYearGroupList2Update === true) {
      yearGroupsArray.push(2);
    }
    if (updateSubjectForm.value.subjectYearGroupList2Update === true) {
      yearGroupsArray.push(3);
    }
    console.log('YearGroupsArray =' + yearGroupsArray);
    //let subjectYearGroupList : Array<number> =
    return new SubjectEntity(null,
      updateSubjectForm.value.subjectFullNameUpdate,
      updateSubjectForm.value.subjectCodeUpdate,
      yearGroupsArray,
      updateSubjectForm.value.subjectTypeUpdate,
      currentSubjectObject.isSubjectAPracticalSubject,
      null);
  }

  CORE_SUBJECT_NOTATION: string = "CORE";
  ELECTIVE_SUBJECT_NOTATION: string = "ELECTIVE";

  // isSubjectOkToBeSubmitted(subjectJsonObject: SubjectEntity): Map<boolean,string> {
  //   let booleanStringRequest: Map<boolean,string> = new Map();
  //   let isSubjectAPracticalSubject:boolean = subjectJsonObject.isSubjectAPracticalSubject;
  //   let subjectTypeOfSubjectObject:string = subjectJsonObject.subjectType;
  //   console.log("isSubjectAPracticalSubjectObject= "+isSubjectAPracticalSubject+", subjectTypeOfSubjectObject="+subjectTypeOfSubjectObject);
  //   console.log("compring isSubjectAPracticalSubject === true response ===>"+(isSubjectAPracticalSubject === true));
  //   if (isSubjectAPracticalSubject===true && isSubjectAPracticalSubject){
  //     console.log("its a practical subject,check if type is elective")
  //     console.log("subjectTypeOfSubjectObject ="+subjectTypeOfSubjectObject+" compared string="+this.ELECTIVE_SUBJECT_NOTATION);
  //     if(subjectTypeOfSubjectObject === this.ELECTIVE_SUBJECT_NOTATION) {
  //       booleanStringRequest.set(true, "Everything ok");
  //       console.log(subjectTypeOfSubjectObject+" is the same as "+this.ELECTIVE_SUBJECT_NOTATION);
  //     }else {
  //       booleanStringRequest.set(false, "If Subject is a practical subject,it cannot be a core subject at the same time.");
  //     }
  //   } else {
  //     booleanStringRequest.set(true,"Everything ok paaaa");
  //   }
  //   console.log("response =>",booleanStringRequest);
  //   return booleanStringRequest;
  // }

  public addSubject(addSubjectForm: AbstractControl): void {

    let subjectJsonObject = this.prepareSubjectJson(addSubjectForm);

      this.accessingService = true;
      this.subjectService.createSubject(subjectJsonObject).subscribe(
        (response: TutorResponsePayload) => {
          this.accessingService = false;
          console.info("response status = " + response.status);
          if (response.status === 0) {
            this.modalAddSubject.dismiss();
            this.ngOnInit();
            swal("Success", "Subject Added Successfully", "success");
          } else {
            swal("Error", response.message, "error");
          }
        },
        (error: any) => {
          swal("Error", "Something went wrong,Try Again", "error");
          console.log(error);
        }
      );

  }

  public openUpdateSubjectModal(subject: SubjectEntity): void {
    this.currentSubjectBeforeUpdateModalInitiation = subject;
    this.modalUpdateSubject.open();
    this.buildUpdateSubjectForm(subject);
  }

  updateSubject(updateSubjectForm: FormGroup): void {
    console.log(updateSubjectForm);
    let subjectId: string = this.currentSubjectBeforeUpdateModalInitiation.id;
    swal({
        title: "Are you sure?",
        text: "This will update information for this Subject !!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Update!",
        cancelButtonText: "No, cancel please!",
        closeOnConfirm: false,
        closeOnCancel: false,
        showLoaderOnConfirm: true
      },
      (isConfirm) => {
        if (isConfirm) {
          /**
           * always use arrow functions otherwise this collides with typescript's this,hence leading to undefined.
           */

          this.subjectService.updateSubject(subjectId, this.prepareSubjectJsonToUpdate(updateSubjectForm, this.currentSubjectBeforeUpdateModalInitiation)).subscribe(
            (response: SubjectResponsePayload) => {
              if (response.status === 0) {
                this.modalUpdateSubject.dismiss();
                swal("Success", "Subject was updated successfully!.", "success");
                this.ngOnInit();
              } else {
                swal("Error Occured", response.message, "error");
              }
            },
            (error) => {
              swal("Error Occured", "Subject was not updated.Try again later.", "error");
            }
          );

        } else {
          swal("Cancelled", "Subject was not updated", "error");
        }
      });

  }

  public deleteAllSubjects() {

    swal({
        title: "Are you sure?",
        text: "This will delete Subjects Permanently!!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Delete All!",
        cancelButtonText: "No, Cancel Please!",
        closeOnConfirm: false,
        closeOnCancel: false,
        showLoaderOnConfirm: true
      },
      (isConfirm) => {
        if (isConfirm) {
          /**
           * always use arrow functions otherwise this collides with typescript's this,hence leading to undefined.
           */
          this.subjectService.deleteAllSubjects().subscribe(
            (response: GeneralResponsePayload) => {
              if (response.status === 0) {
                this.ngOnInit();
                swal("Deleted!", "All Subjects Have Been Deleted successfully", "success");
              } else {
                this.ngOnInit();
                swal("Could Not Delete!", "Something went wrong on the server.Try Again", "error");
              }
            },
            (error: any) => {
              swal("Error", "No Subject was deleted", "error");
            }
          );


        } else {
          swal("Cancelled", "No Subject was deleted", "error");
        }
      });
  }

}
