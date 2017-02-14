import {Injectable} from '@angular/core';
import {ProgrammeGroupEntity} from "../models/programme-group-entity";
import {DepartmentEntity} from "../models/department-entity";

@Injectable()
export class ProgrammeGroupFiltrationService {

  constructor() {
  }

  /**
   *
   * remove all ProgrammeGroups which have been set to differrent departments already
   * @param departmentEntities => all DepartmentEntities in Db
   * @param programmeGroupEntities => all ProgrammeGroupEntities in Db,make sure to pass in programmeGroupEntities with unique programmeiInitials.
   * @returns {Array<ProgrammeGroupEntity>}
   */
  filterProgrammeGroupsAlreadySetToDepartment(departmentEntities: Array<DepartmentEntity>, programmeGroupEntities: Array<ProgrammeGroupEntity>): Array<ProgrammeGroupEntity> {
    if (programmeGroupEntities.length === 0 || departmentEntities.length === 0) {
      return programmeGroupEntities;
    } else {
      let finalProgrammeGroupEntities: Array<ProgrammeGroupEntity> = [];
      for (let i: number = 0; i < programmeGroupEntities.length; i++) {
        let currentProgrammeEntity: ProgrammeGroupEntity = programmeGroupEntities[i];
        if (this.doesProgrammeInitialsExistOnListOfDepartments(currentProgrammeEntity.programmeInitials, departmentEntities) === false) {
          finalProgrammeGroupEntities.push(currentProgrammeEntity);
        }
      }
      console.log('Incoming programmeGroup=>', programmeGroupEntities);
      console.log('Filtered programmeGroups(removal of already set Departments with programmeInitials)=>', finalProgrammeGroupEntities);
      return finalProgrammeGroupEntities;
    }
  }

  protected doesProgrammeInitialsExistOnListOfDepartments(programmeGroupInitials: string, departmentEntities: Array<DepartmentEntity>): boolean {
    let doesProgrammeInitialsExistOnListOfDepartments: boolean = false;
    for (let i: number = 0; i < departmentEntities.length; i++) {
      if (programmeGroupInitials.trim().toUpperCase() === departmentEntities[i].deptProgrammeInitials.trim().toUpperCase()) {
        doesProgrammeInitialsExistOnListOfDepartments = true;
      }
    }
    return doesProgrammeInitialsExistOnListOfDepartments;
  }
}
