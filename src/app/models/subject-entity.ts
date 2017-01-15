export class SubjectEntity {
  constructor(public id:number,
              public subjectFullName:string,
              public subjectCode:string,
              public totalPeriodsForYearGroup:string,
              public subjectYearGroupList:Array<number>,
              public subjectType:string){}
}
