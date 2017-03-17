import {ProgrammeDay} from "./programme-day";
export class TutorPersonalTimeTableEntity {

  /**
   *
   * @param tutorUniqueIdInDb
   * @param programmeDaysList
   */
  constructor(public tutorUniqueIdInDb: string,
              public programmeDaysList: Array<ProgrammeDay>) {
  }
}
