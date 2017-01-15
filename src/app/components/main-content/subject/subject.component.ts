import {Component, OnInit, ViewChild} from '@angular/core';
import {SubjectService} from "../../../services/subject.service";
import {FormBuilder, FormGroup, Validators, AbstractControl} from "@angular/forms";
import {ModalComponent} from "ng2-bs3-modal/components/modal";
import {SubjectsArrayResponsePayload} from "../../../models/subjects-array-response-payload";
import {SubjectEntity} from "../../../models/subject-entity";

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
  isSubjectsListEmpty: boolean = false;
  formIsValid: boolean = false;
  noOfSubjects:number;

  constructor(public subjectService: SubjectService,
              public formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getAllSubjects();
    this.buildAddSubjectForm();
    this.buildUpdateSubjectForm();
  }

  public getAllSubjects(): void {
    this.subjectService.getAllSubjects().subscribe(
      (response: SubjectsArrayResponsePayload) => {
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

  private buildAddSubjectForm(): void {
    this.addSubjectForm = this.formBuilder.group(
      {
        'subjectFullName': ['',
          Validators.required],
        'subjectCode': ['',
          Validators.required],
        'subjectYearGroupList':['',
          Validators.required],
        'subjectType': [
          Validators.required]
      },
    );

    this.addSubjectForm.valueChanges
      .subscribe(data => this.onAddSubjectFormValueChanged(data));
    this.onAddSubjectFormValueChanged(); // (re)set validation messages now
  }
  private buildUpdateSubjectForm(subject?:SubjectEntity): void {
    /*
    * since form must be initialized in ngOnInit,at that instance,
    * subject will be null or undefined hence the check
    * */
    if(typeof subject === "undefined"){
      this.updateSubjectForm = this.formBuilder.group(
        {
          'subjectFullNameUpdate': ['',
            Validators.required],
          'subjectCodeUpdate': ['',
            Validators.required],
          'subjectYearGroupListUpdate': ['',
            Validators.required],
          'subjectTypeUpdate': ['',
            Validators.required]
        },
      );
    }else {
      this.updateSubjectForm = this.formBuilder.group(
        {
          'subjectFullNameUpdate': [subject.subjectFullName,
            Validators.required],
          'subjectCodeUpdate': [subject.subjectCode,
            Validators.required],
          'subjectYearGroupListUpdate': [subject.subjectYearGroupList,
            Validators.required],
          'subjectTypeUpdate': [subject.subjectType,
            Validators.required]
        },
      );
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
    'subjectYearGroupList': '',
    'subjectType': '',
    'subjectFullNameUpdate': '',
    'subjectCodeUpdate': '',
    'subjectYearGroupListUpdate': '',
    'subjectTypeUpdate': '',

  };
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

  public openAddSubjectModal():void{
    this.modalAddSubject.open();
  }

  private prepareSubjectJson(addSubjectForm: AbstractControl):SubjectEntity{

    console.log(addSubjectForm.value.subjectYearGroupList);
    return new SubjectEntity(null,
                             addSubjectForm.value.subjectFullName,
                             addSubjectForm.value.subjectCode,
                             null,
                             addSubjectForm.value.subjectType);
  }

  public addSubject(addSubjectForm: AbstractControl):void{
    let subjectJsonObject = this.prepareSubjectJson(addSubjectForm);
  }

  public openUpdateSubjectModal(subject:SubjectEntity):void{
    this.modalUpdateSubject.open();
    this.buildUpdateSubjectForm(subject);
  }


}
