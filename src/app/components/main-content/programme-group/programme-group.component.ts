import {Component, OnInit} from '@angular/core';
import {ProgrammeGroupService} from "../../../services/programme-group.service";
import {ProgrammeGroupEntity} from "../../../models/programme-group-entity";

declare var swal: any;
@Component({
  selector: 'app-programme-group',
  templateUrl: './programme-group.component.html',
  styleUrls: ['./programme-group.component.css'],
  providers: [ProgrammeGroupService]
})
export class ProgrammeGroupComponent implements OnInit {

  noOfProgrammeGroups: number;
  isProgrammeGroupListEmpty: boolean = false;
  programmeGroups: Array<ProgrammeGroupEntity>;

  constructor(private programmeGroupService: ProgrammeGroupService) {
  }

  ngOnInit() {
    this.getAllProgrammeGroups();
  }

  refreshPage(): void {

  }

  openAddProgrammeGroupModal(): void {

  }

  deleteProgrammeGroup(programmeGroupId:string):void{

    swal({
        title: "Are you sure?",
        text: "This will delete Programme Permanently!!",
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
          this.programmeGroupService.deleteProgrammeGroup(programmeGroupId)
            .subscribe(
              (r)=>{
                if(r.status===0){
                  this.ngOnInit();
                  swal("Successful","Programme deleted successfully","success");
                }else{
                  swal("Error",r.message,"error");
                }
              },
              error=>{
                swal("Error","Something went wrong.Try again","error");
              }
            );

        } else {
          swal("Cancelled", "Programme was not deleted", "error");
        }
      });
  }

  deleteAllProgrammeGroups(): void {

  }

  getAllProgrammeGroups(): void {
    this.programmeGroupService.getAllProgrammeGroups()
      .subscribe(
        r => {
          if (r.status === 0) {
            if (r.responseObject.length === 0) {
              this.isProgrammeGroupListEmpty = true;
            } else {
              this.noOfProgrammeGroups = r.responseObject.length;
              this.programmeGroups = r.responseObject;
            }
          } else {
            swal("Error", r.message || "Please Try Again Later", "error");
          }
        },
        error => {
          swal("Something went wrong", "Please Try Again", "error");
        }
      );
  }


}
