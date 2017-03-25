export class PeriodOrLecture {

  /**
   *
   * @param periodName
   * @param periodNumber
   * @param periodStartandEndTime
   * @param isAllocated
   * @param subjectUniqueIdInDb
   * @param subjectFullName
   * @param tutorUniqueId
   * @param tutorFullName
   * @param programmeCodeThatTutorIsTeaching
   */
  constructor(public periodName: string,
              public periodNumber: number,
              public periodStartandEndTime: string,
              public isAllocated: boolean,
              public subjectUniqueIdInDb: string,
              public subjectFullName: string,
              public tutorUniqueId: string,
              public tutorFullName: string,
              public programmeCodeThatTutorIsTeaching: string) {
  }
}
