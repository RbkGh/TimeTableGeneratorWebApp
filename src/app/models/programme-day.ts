import {PeriodOrLecture} from "./period-or-lecture";
export class ProgrammeDay {
  constructor(public dayName: string,
              public periodList: Array<PeriodOrLecture>) {

  }
}
