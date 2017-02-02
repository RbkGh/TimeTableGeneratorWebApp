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
