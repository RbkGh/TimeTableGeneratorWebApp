export class DepartmentEntity {

  constructor(public id: string,
              public deptName: string,
              public deptHODtutorId: string,
              public deptHODdeputyTutorId: string,
              public deptProgrammeInitials: string,
              public deptType: string,
              public programmeSubjectsDocIdList: Array<string>) {
  }
}
