import {Component, OnInit} from '@angular/core';
import {TimeTableGenerationService} from "../../../services/time-table-generation.service";
import {TimeTableMainEntity} from "../../../models/time-table-main-entity";
import {TimeTableMainEntityArrayResponsePayload} from "../../../models/time-table-main-entity-array-response-payload";

declare var swal: any;
@Component({
  selector: 'app-time-table-mgmt',
  templateUrl: './time-table-mgmt.component.html',
  styleUrls: ['./time-table-mgmt.component.css'],
  providers: [TimeTableGenerationService]
})
export class TimeTableMgmtComponent implements OnInit {

  timeTableMainEntitiesList: Array<TimeTableMainEntity>;
  noOfTimeTableMainEntities: number;

  constructor(private timeTableGenerationService: TimeTableGenerationService) {

  }

  ngOnInit() {
  }

  getAllGeneratedTimeTables(): void {
    this.timeTableGenerationService.getAllGeneratedTimeTables().subscribe(
      (response: TimeTableMainEntityArrayResponsePayload) => {
        if ((response.status === 0) && (response.responseObject.length > 0)) {
          this.timeTableMainEntitiesList = response.responseObject;
          this.noOfTimeTableMainEntities = response.responseObject.length;
        } else if ((response.status === 0) && (response.responseObject.length === 0)) {
          swal("Error", "No timetables generated currently.", "error");
        } else {
          swal("Error", "Something went wrong.Please Try Again", "error");
        }
      },
      (error: any) => {
        swal("Error", "Something went wrong.Please Try Again", "error");
      }
    );
  }

}
