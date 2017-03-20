import {Component, OnInit} from '@angular/core';
import {TimeTableGenerationService} from "../../../services/time-table-generation.service";
import {TimeTableMainEntity} from "../../../models/time-table-main-entity";
import {TimeTableMainEntityArrayResponsePayload} from "../../../models/time-table-main-entity-array-response-payload";
import {ProgrammeGroupPersonalTimeTableEntity} from "../../../models/programme-group-personal-time-table-entity";
import {TutorPersonalTimeTableEntity} from "../../../models/tutor-personal-time-table-entity";

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

  isSingleTimeTableViewVisible : boolean = false;
  isTutorsTimeTablesVisible : boolean = false;
  isProgrammeGroupTimeTablesVisible : boolean = false;

  timeTableTypeItems: Array<any> = [];

  successfullyGeneratedTimeTableMainEntity: TimeTableMainEntity;
  programmeGroupPersonalTimeTableDocsList: Array<ProgrammeGroupPersonalTimeTableEntity>;
  tutorPersonalTimeTableDocsList: Array<TutorPersonalTimeTableEntity>;

  constructor(private timeTableGenerationService: TimeTableGenerationService) {

  }

  ngOnInit() {
    this.getAllGeneratedTimeTables();
  }

  getAllGeneratedTimeTables(): void {
    this.timeTableGenerationService.getAllGeneratedTimeTables().subscribe(
      (response: TimeTableMainEntityArrayResponsePayload) => {
        if ((response.status === 0) && (response.responseObject.length > 0)) {
          this.timeTableMainEntitiesList = response.responseObject;
          console.log("timetableMainEntitiesList ==>",JSON.stringify(this.timeTableMainEntitiesList));
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

  activateSingleTimeTableView(timeTableMainEntity : TimeTableMainEntity):void{
    this.successfullyGeneratedTimeTableMainEntity = timeTableMainEntity;
    this.isSingleTimeTableViewVisible = true;
    this.timeTableTypeItems = this.getTimeTableTypesItems();
  }

  activateAllTimeTablesView():void{
    this.isSingleTimeTableViewVisible = false;
  }

  public selectedTimeTableType(value: any): void {
    console.log('Selected value is: ', value);
    console.log('value id=', value.id);
    let valueToSwitch: number = value.id;

    switch (valueToSwitch) {
      case this.TIMETABLE_TYPE_PROGRAMMEGROUP :
        //DO IMPLEMENTATION TO SHOW ALL TIMETABLE FOR ALL PROGRAMMEGROUPS RETURNED FROM SERVICE
        this.getProgrammeGroupsTimeTables(this.successfullyGeneratedTimeTableMainEntity.programmeGroupPersonalTimeTableDocs);
        break;
      case this.TIMETABLE_TYPE_TUTOR :
        //DO IMPLEMENTATION TO SHOW ALL TIMETABLE FOR ALL TUTORS RETURNED FROM SERVICE.
        this.getTutorsTimeTables(this.successfullyGeneratedTimeTableMainEntity.tutorPersonalTimeTableDocs);
        break;
      default :
        //DEFAULT IMPLEMENTAION
        this.getTutorsTimeTables(this.successfullyGeneratedTimeTableMainEntity.tutorPersonalTimeTableDocs);
        break;

    }
  }

  /**
   * ID of programmeGroup Type of timetable used in ng-select library
   * @type {number}
   */
  TIMETABLE_TYPE_PROGRAMMEGROUP: number = 1;
  TIMETABLE_TYPE_TUTOR: number = 2;

  /**
   * ng-select library takes data in the form of {id,text} objects.
   *
   * @returns {Array<any>}
   */
  public getTimeTableTypesItems(): Array<any> {
    let timeTableTypes: Array<any> = [{
      id: this.TIMETABLE_TYPE_PROGRAMMEGROUP,
      text: 'Classes/ProgrammeGroups TimeTable'
    }, {
      id: this.TIMETABLE_TYPE_TUTOR,
      text: 'Tutors TimeTable'
    }];

    console.info('TimeTable Type Objects to be populated in dropdown: ', timeTableTypes);
    return timeTableTypes;
  }

  /**
   * programmeGroups timetables list
   * @param programmeGroupPersonalTimeTableDocs {@link TimeTableMainEntity.programmeGroupPersonalTimeTableDocs}
   */
  getProgrammeGroupsTimeTables(programmeGroupPersonalTimeTableDocs: Array<ProgrammeGroupPersonalTimeTableEntity>) {
    this.programmeGroupPersonalTimeTableDocsList = programmeGroupPersonalTimeTableDocs;
    //show programmeGroups timetables and hide tutors timetable.
    this.isProgrammeGroupTimeTablesVisible = true;//show programmeGroup timetable
    this.isTutorsTimeTablesVisible = false;//hide tutors timetable
  }

  getTutorsTimeTables(tutorPersonalTimeTableDocs: Array<TutorPersonalTimeTableEntity>) {
    this.tutorPersonalTimeTableDocsList = tutorPersonalTimeTableDocs;
    //show tutors timetables and hide programeGroups timetables.
    this.isTutorsTimeTablesVisible = true;
    this.isProgrammeGroupTimeTablesVisible = false;
  }

  refreshTimeTableTypeData(value: any): void {
    //this.value = value;
    console.log('Data1 =', value);
  }

  public typedChar(value: any): void {
    console.log('New search input1: ', value);
  }
}
