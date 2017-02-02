export interface ProgrammeGroupEntity {
  id: string;
  programmeFullName: string;
  programmeInitials: string;
  yearGroup: number;
  programmeCode: string;
  yearGroupList: number[];
  technicalWorkshopOrLabRequired: boolean;
}
