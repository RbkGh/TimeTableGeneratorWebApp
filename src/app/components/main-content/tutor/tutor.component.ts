import {Component, OnInit, ViewChild} from "@angular/core";
import {TutorService} from "../../../services/tutor.service";
import {TutorResponsePayload, Tutor} from "../../../models/TutorResponsePayload";
import {GeneralResponsePayload} from "../../../models/general-response-payload";
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import {AddTutorComponent} from "./add-tutor/add-tutor.component";

declare var swal: any;

@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.css'],
  viewProviders: [AddTutorComponent],
  providers: [TutorService]
})
export class TutorComponent implements OnInit {

  tutors: Array<Tutor>;
  errorMsg: string;
  @ViewChild('modal')
  modal: ModalComponent;


  constructor(public tutorService: TutorService) {

  }

  ngOnInit() {
    this.tutorService.getAllTutors().subscribe((response: TutorResponsePayload) => {
      if (response.status === 0) {
        console.log(response);
        this.tutors = response.responseObject;
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
        swal("Deleted!", "Tutor has has been deleted successfully.", "success");
        this.ngOnInit();
      }
      else
        swal("Cancelled", "Could Not Delete Tutor.Please Try Again Later.", "error");
    }, (err) => {
      swal("Cancelled", "Could Not Delete Tutor.Please Try Again.", "error");
    });
  }

  addTutor() {
    this.modal.open();
  }

}
