import {ProgrammeDay} from "./programme-day";
import {Tutor} from "./TutorResponsePayload";
export class TutorPersonalTimeTableEntity {

  /**
   *
   * @param tutorUniqueIdInDb
   * @param tutorDoc
   * @param programmeDaysList
   */
  constructor(public tutorUniqueIdInDb: string,
              public tutorDoc : Tutor,
              public programmeDaysList: Array<ProgrammeDay>) {
  }
}
