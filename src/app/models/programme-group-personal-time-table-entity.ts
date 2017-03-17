import {ProgrammeDay} from "./programme-day";
export class ProgrammeGroupPersonalTimeTableEntity {

  constructor(public programmeCode: string,
              public programmeDaysList: Array<ProgrammeDay>) {

  }
}

