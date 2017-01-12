import {Component, OnInit, ViewChild, Input, AfterViewInit} from "@angular/core";
import {TutorService} from "../../../services/tutor.service";
import {TutorResponsePayload, Tutor} from "../../../models/TutorResponsePayload";
import {GeneralResponsePayload} from "../../../models/general-response-payload";
import {ModalComponent} from "ng2-bs3-modal/ng2-bs3-modal";
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import {isUndefined} from "util";

declare var swal: any;

@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.css'],
  providers: [TutorService]
})
export class TutorComponent implements OnInit,AfterViewInit {


  tutors: Array<Tutor>;
  noOfTutors: number;
  errorMsg: string;
  @ViewChild('modalAddTutor')
  modalAddTutor: ModalComponent;
  @ViewChild('modalUpdateTutor')
  modalUpdateTutor: ModalComponent;
  isTutorsListEmpty: boolean = false;

  updateTutorForm: FormGroup;

  @Input() firstName: string;
  @Input() surName: string;
  @Input() phoneNumber: string;
  @Input() emailAddress: string;
  @Input() minPeriodLoad: string;
  @Input() maxPeriodLoad: string;
  @Input() tutorSubjectSpeciality: string;


  constructor(public tutorService: TutorService,
              public formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.getAllTutors();
    this.buildUpdateTutorForm();
  }

  getAllTutors():void{
    this.tutorService.getAllTutors().subscribe((response: TutorResponsePayload) => {
      if (response.status === 0) {
        console.log(response);
        this.tutors = response.responseObject;
        if (this.tutors.length > 0) {
          this.isTutorsListEmpty = false;
          this.noOfTutors = this.tutors.length;
        }
        else if(this.tutors.length === 0){
          this.noOfTutors = 0;
          this.isTutorsListEmpty = true;
        }
      } else {
        swal("Error", "Something went wrong,try again.", "error");
      }
    }, (error) => {
      swal("Error", "Ensure you have a working internet connection", "error");
      console.log(error);
    });
  }

  ngAfterViewInit(): void {

  }

  refreshPage():void{
    this.ngOnInit();
  }

  buildUpdateTutorForm(tutor?:Tutor): void {
    if(typeof tutor === "undefined"){
      this.updateTutorForm = this.formBuilder.group({
        'firstNameUpdate':[''],
        'surNameUpdate': [''],
        'phoneNumberUpdate':[''],
        'emailAddressUpdate':[''],
        'minPeriodLoadUpdate':[''],
        'maxPeriodLoadUpdate':[''],
        'tutorSubjectSpecialityUpdate': ['']
      });
    }else
    this.updateTutorForm = this.formBuilder.group(
      {
        'firstNameUpdate': [tutor.firstName],
        'surNameUpdate': [tutor.surName],
        'phoneNumberUpdate': [tutor.phoneNumber,
          Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(/^\d{10}$/)
          ])
        ],
        'emailAddressUpdate': [tutor.emailAddress,
        Validators.compose([
          Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        ])],
        'minPeriodLoadUpdate': [tutor.minPeriodLoad],
        'maxPeriodLoadUpdate': [tutor.maxPeriodLoad],
        'tutorSubjectSpecialityUpdate': [tutor.tutorSubjectSpeciality]
      }
    );
    this.updateTutorForm.valueChanges
      .subscribe(data => this.onUpdateTutorFormValueChanged(data));
    this.onUpdateTutorFormValueChanged(); // (re)set validation messages now

  }

  deleteTutor(currentTutorId: string): void {
    console.log("tutorId=" + currentTutorId);
    swal({
        title: "Are you sure?",
        text: "This will delete Tutor Permanently!!",
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
          this.deleteTutorUsingService(currentTutorId);

        } else {
          swal("Cancelled", "Tutor was not deleted", "error");
        }
      });


  }

  onUpdateTutorFormValueChanged(data?: any): void {
    if (!this.updateTutorForm) { return; }
    const form = this.updateTutorForm;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      //if form is touched,dirty, and if the control is invalid,per validation rule,
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
  formErrors = {
    'firstNameUpdate': '',
    'surNameUpdate': '',
    'phoneNumberUpdate':'',
    'emailAddressUpdate':'',
    'minPeriodLoadUpdate':'',
    'maxPeriodLoadUpdate':'',
    'tutorSubjectSpecialityUpdate':''
  };
  validationMessages = {
    'firstNameUpdate': {
      'required':      'First Name is required.'
    },
    'surNameUpdate': {
      'required': 'Sur Name is required.'
    },
    'phoneNumberUpdate':{
      'required':      'Phone number is required.',
      'minlength':     'Phone number must be at least 10 numbers long.',
      'maxlength':     'Phone number must not be more than 10 numbers long.',
    }
  };

  public deleteTutorUsingService(currentTutorId: string): void {
    this.tutorService.deleteTutor(currentTutorId).subscribe((r: GeneralResponsePayload) => {
      if (r.status === 0) {
        swal("Deleted!", "Tutor has been deleted successfully.", "success");
        this.ngOnInit();
      }
      else
        swal("Cancelled", "Could Not Delete Tutor.Tutor may have been deleted already.Please Try Again Later Or Refresh The whole page", "error");
    }, (err) => {
      swal("Cancelled", "Could Not Delete Tutor.Please Try Again.", "error");
    });
  }


  public deleteAllTutors() {
    if (this.tutors.length <= 0) {
      swal("No Tutors!", "There are no Tutors to delete", "error");
    } else {
      swal({
          title: "Are you sure?",
          text: "This will delete All Tutors Permanently!!",
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
            this.tutorService.deleteAllTutors().subscribe(
              (response: TutorResponsePayload) => {
                if (response.status === 0) {
                  this.ngOnInit();
                  swal("Deleted!", "All Tutors Have Been Deleted successfully", "success");
                } else {
                  this.ngOnInit();
                  swal("Could Not Delete!", "Something went wrong on the server.Try Again", "error");
                }
              },
              (error: any) => {
                swal("Cancelled", "No Tutor was deleted", "error");
              }
            );


          } else {
            swal("Cancelled", "No Tutor was deleted", "error");
          }
        });

    }

  }

  openAddTutorModal() {
    this.modalAddTutor.open();
  }

  openUpdateTutorModal(tutor:Tutor) {
    this.buildUpdateTutorForm(tutor);
    this.modalUpdateTutor.open();

  }

  //TODO Create SubjectCode And Id Automatically at Server side
  prepareTutorJson(): Tutor {
    return new Tutor(null, this.firstName,
      this.surName,
      "",
      this.phoneNumber,
      this.emailAddress,
      null,
      +this.minPeriodLoad,
      +this.maxPeriodLoad,
      null,
      this.tutorSubjectSpeciality);
  }

  addTutor() {
    let tutorJsonObject: Tutor = this.prepareTutorJson();
    this.tutorService.createTutor(tutorJsonObject).subscribe(
      (response: TutorResponsePayload) => {
        if (response.status === 0) {
          this.modalAddTutor.close();
          this.ngOnInit();
          swal("Created!", "Tutor has has been created successfully.", "success");
        }
        else {
          swal("Error", "Could Not Create New Tutor.Please Try Again Later.", "error");
        }
      },
      (error: any) => {
        swal("SERVER ERROR", "Could Not Create New Tutor.Please Try Again After A few minutes", "error");
      }
    );

  }

  updateTutor(tutorId: string, tutorJsonObjToBeUpdated: Tutor): void {

  }


}
