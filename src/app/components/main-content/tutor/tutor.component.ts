import {Component, OnInit, ViewChild, Input, AfterViewInit} from "@angular/core";
import {TutorService} from "../../../services/tutor.service";
import {TutorResponsePayload, Tutor} from "../../../models/TutorResponsePayload";
import {ModalComponent} from "ng2-bs3-modal/ng2-bs3-modal";
import {FormBuilder, FormGroup, Validators, AbstractControl} from "@angular/forms";
import {TutorsArrayResponsePayload} from "../../../models/tutors-array-response-payload";

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
  @ViewChild('modalAddTutor')
  modalAddTutor: ModalComponent;
  @ViewChild('modalUpdateTutor')
  modalUpdateTutor: ModalComponent;
  isTutorsListEmpty: boolean = false;

  updateTutorForm: FormGroup;
  addTutorForm: FormGroup;
  formIsValid: boolean = false;

  currentTutorObjBeforeUpdateModalInitiation: Tutor;

  constructor(public tutorService: TutorService,
              public formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.getAllTutors();
    this.buildAddTutorForm();
    this.buildUpdateTutorForm();
  }

  getAllTutors(): void {
    this.tutorService.getAllTutors().subscribe((response: TutorsArrayResponsePayload) => {
      if (response.status === 0) {
        console.log(response);
        this.tutors = response.responseObject;
        if (this.tutors.length > 0) {
          this.isTutorsListEmpty = false;
          this.noOfTutors = this.tutors.length;
        }
        else if (this.tutors.length === 0) {
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

  refreshPage(): void {
    this.ngOnInit();
  }

  buildUpdateTutorForm(tutor?: Tutor): void {
    if (typeof tutor === "undefined") {
      this.updateTutorForm = this.formBuilder.group({
        'firstNameUpdate': [''],
        'surNameUpdate': [''],
        'phoneNumberUpdate': [''],
        'emailAddressUpdate': [''],
        'minPeriodLoadUpdate': [''],
        'maxPeriodLoadUpdate': [''],
        'tutorSubjectSpecialityUpdate': ['']
      });
    } else
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

  buildAddTutorForm(): void {

    this.addTutorForm = this.formBuilder.group(
      {
        'firstName': ['',
          Validators.required],
        'surName': ['',
          Validators.required],
        'phoneNumber': ['',
          Validators.compose([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern(/^\d{10}$/)
          ])
        ],
        'emailAddress': ['',
          Validators.compose([
            Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
          ])],
        'minPeriodLoad': ['',
          Validators.required],
        'maxPeriodLoad': ['',
          Validators.required],
        'tutorSubjectSpeciality': ['',
          Validators.required]
      }
    );
    this.addTutorForm.valueChanges
      .subscribe(data => this.onAddTutorFormValueChanged(data));
    this.onAddTutorFormValueChanged(); // (re)set validation messages now

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

  onAddTutorFormValueChanged(data?: any): void {
    if (!this.addTutorForm) {
      return;
    }
    const form = this.addTutorForm;

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

  onUpdateTutorFormValueChanged(data?: any): void {
    if (!this.updateTutorForm) {
      return;
    }
    const form = this.updateTutorForm;

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
    'firstName': '',
    'surName': '',
    'phoneNumber': '',
    'emailAddress': '',
    'minPeriodLoad': '',
    'maxPeriodLoad': '',
    'tutorSubjectSpeciality': '',
    'firstNameUpdate': '',
    'surNameUpdate': '',
    'phoneNumberUpdate': '',
    'emailAddressUpdate': '',
    'minPeriodLoadUpdate': '',
    'maxPeriodLoadUpdate': '',
    'tutorSubjectSpecialityUpdate': ''
  };
  validationMessages = {
    'firstName': {
      'required': 'First Name is required.'
    },
    'surName': {
      'required': 'Sir Name is required.'
    },
    'phoneNumber': {
      'required': 'Phone number is required.',
      'minlength': 'Phone number must be at least 10 numbers long.',
      'maxlength': 'Phone number must not be more than 10 numbers long.',
    },
    'emailAddress': {
      'required': 'Email address is required.'
    },
    'minPeriodLoad': {
      'required': 'Minimum periods is required.'
    },
    'maxPeriodLoad': {
      'required': 'Maximum periods is required.'
    },
    'tutorSubjectSpeciality': {
      'required': 'Tutor\'s Speciality type is required.'
    },
    'firstNameUpdate': {
      'required': 'First Name is required.'
    },
    'surNameUpdate': {
      'required': 'Sur Name is required.'
    },
    'phoneNumberUpdate': {
      'required': 'Phone number is required.',
      'minlength': 'Phone number must be at least 10 numbers long.',
      'maxlength': 'Phone number must not be more than 10 numbers long.',
      'match': 'Only numbers are allowed'
    },
    'emailAddressUpdate': {
      'required': 'Email address is required.'
    },
    'minPeriodLoadUpdate': {
      'required': 'Minimum periods is required.'
    },
    'maxPeriodLoadUpdate': {
      'required': 'Maximum periods is required.'
    },
    'tutorSubjectSpecialityUpdate': {
      'required': 'Tutor\'s Speciality type is required.'
    }
  };

  public deleteTutorUsingService(currentTutorId: string): void {
    this.tutorService.deleteTutor(currentTutorId).subscribe((r: TutorResponsePayload) => {
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
    this.buildAddTutorForm();
  }

  openUpdateTutorModal(tutor: Tutor) {
    this.currentTutorObjBeforeUpdateModalInitiation = tutor;
    this.buildUpdateTutorForm(tutor);
    this.modalUpdateTutor.open();

  }

  //TODO Create SubjectCode And Id Automatically at Server side
  prepareTutorJson(addTutorFormValue: AbstractControl): Tutor {
    return new Tutor(null, addTutorFormValue.value.firstName,
      addTutorFormValue.value.surName,
      "",
      addTutorFormValue.value.phoneNumber,
      addTutorFormValue.value.emailAddress,
      null,
      +addTutorFormValue.value.minPeriodLoad,
      +addTutorFormValue.value.maxPeriodLoad,
      null,
      addTutorFormValue.value.tutorSubjectSpeciality);
  }

  addTutor(addTutorFormValue: AbstractControl) {
    let tutorJsonObject: Tutor = this.prepareTutorJson(addTutorFormValue);
    this.tutorService.createTutor(tutorJsonObject).subscribe(
      (response: TutorResponsePayload) => {
        if (response.status === 0) {
          this.modalAddTutor.dismiss();
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

  prepareTutorJsonToUpdate(updateTutorForm: FormGroup): Tutor {

    let firstNameUpdate: string = updateTutorForm.value.firstNameUpdate;
    return new Tutor(null, firstNameUpdate,
      updateTutorForm.value.surNameUpdate,
      "",
      updateTutorForm.value.phoneNumberUpdate,
      updateTutorForm.value.emailAddressUpdate,
      null,
      +updateTutorForm.value.minPeriodLoadUpdate,
      +updateTutorForm.value.maxPeriodLoadUpdate,
      null,
      updateTutorForm.value.tutorSubjectSpecialityUpdate);
  }

  updateTutor(updateTutorForm: FormGroup): void {
    console.log(updateTutorForm);
    let tutorId = this.currentTutorObjBeforeUpdateModalInitiation.id;
    swal({
        title: "Are you sure?",
        text: "This will update information for this Tutor !!",
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
          this.modalUpdateTutor.dismiss();
          this.tutorService.updateTutor(tutorId, this.prepareTutorJsonToUpdate(updateTutorForm)).subscribe(
            (response: TutorResponsePayload) => {
              if (response.status === 0) {
                swal("Success", "Tutor was updated successfully!.", "success");
                this.ngOnInit();
              } else {
                swal("Error Occured", "Tutor was not updated.Try again later.", "error");
              }
            },
            (error) => {
              swal("Error Occured", "Tutor was not updated.Try again later.", "error");
            }
          );

        } else {
          swal("Cancelled", "Tutor was not updated", "error");
        }
      });

  }


}
