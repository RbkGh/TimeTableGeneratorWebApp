import {TutorPersonalTimeTableEntity} from "./tutor-personal-time-table-entity";
import {ProgrammeGroupPersonalTimeTableEntity} from "./programme-group-personal-time-table-entity";
export class TimeTableMainEntity {
  /**
   *
   * @param year
   * @param timeTableName
   * @param tutorPersonalTimeTableDocs
   * @param programmeGroupPersonalTimeTableDocs
   */
  constructor(public year: number,
              public timeTableName: string,
              public tutorPersonalTimeTableDocs: Array<TutorPersonalTimeTableEntity>,
              public programmeGroupPersonalTimeTableDocs: Array<ProgrammeGroupPersonalTimeTableEntity>) {
  }
}
