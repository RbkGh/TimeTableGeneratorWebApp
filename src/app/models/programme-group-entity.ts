export class ProgrammeGroupEntity {
  constructor(public id: string,
              public programmeFullName: string,
              public programmeInitials: string,
              public yearGroup: number,
              public programmeCode: string,
              public yearGroupList: Array<number>,
              public technicalWorkshopOrLabRequired: boolean) {
  }
}
