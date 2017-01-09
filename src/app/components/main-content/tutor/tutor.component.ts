import {Component, OnInit, ViewChild, Input} from "@angular/core";
import {TutorService} from "../../../services/tutor.service";
import {TutorResponsePayload, Tutor} from "../../../models/TutorResponsePayload";
import {GeneralResponsePayload} from "../../../models/general-response-payload";
import {ModalComponent} from "ng2-bs3-modal/ng2-bs3-modal";

declare var swal: any;

@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.css'],
  providers: [TutorService]
})
export class TutorComponent implements OnInit {

  tutors: Array<Tutor>;
  errorMsg: string;
  @ViewChild('modal')
  modal: ModalComponent;
  isTutorsListEmpty: boolean;

  @Input() firstName: string;
  @Input() surName: string;
  @Input() phoneNumber: string;
  @Input() emailAddress: string;
  @Input() minPeriodLoad: string;
  @Input() maxPeriodLoad: string;
  @Input() tutorSubjectSpeciality: string;


  constructor(public tutorService: TutorService) {

  }

  ngOnInit() {
    this.tutorService.getAllTutors().subscribe((response: TutorResponsePayload) => {
      if (response.status === 0) {
        console.log(response);
        this.tutors = response.responseObject;
        if (this.tutors.length > 0) {
          this.isTutorsListEmpty = false;
        }
        else
          this.isTutorsListEmpty = true;
        return true;
      } else {
        this.errorMsg = "Something went Wrong,Try Again";
        return false;
      }
    }, (error) => {
      //Observable.throw(error.json().error || 'Server error');
      this.errorMsg = "Something went Wrong,Try Again";
      return false;
    });
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

  public deleteTutorUsingService(currentTutorId: string): void {
    this.tutorService.deleteTutor(currentTutorId).subscribe((r: GeneralResponsePayload) => {
      if (r.status === 0) {
        swal("Deleted!", "Tutor(s) have been deleted successfully.", "success");
        this.ngOnInit();
      }
      else
        swal("Cancelled", "Could Not Delete Tutor.Please Try Again Later.", "error");
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
            this.tutors.forEach((t: Tutor) => {
              this.deleteTutorUsingService(t.id);
            });

            this.ngOnInit();
            swal("Deleted!", "All Tutors Have Been Deleted successfully", "success");


          } else {
            swal("Cancelled", "No Tutor was deleted", "error");
          }
        });

    }

  }

  openTutorModal() {
    this.modal.open();
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
          this.modal.close();
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


}
