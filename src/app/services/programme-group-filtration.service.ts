import {Injectable} from '@angular/core';
import {ProgrammeGroupEntity} from "../models/programme-group-entity";
import {DepartmentEntity} from "../models/department-entity";

@Injectable()
export class ProgrammeGroupFiltrationService {

  constructor() {
  }

  /**
   * TODO--NOT FULLY WORKING IN SOME SITUATIONS.
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


        let programInitialsMatchCount: number = 0;
        for (let iDept: number = 0; iDept < departmentEntities.length; iDept++) {
          programInitialsMatchCount = 0; //reset in every loop
          let deptEntity: DepartmentEntity = departmentEntities[iDept];
          console.log('DeptProgrammInitials=%s ProgrammeEntityInitials =%s same=%s', deptEntity.deptProgrammeInitials.trim().toUpperCase(), currentProgrammeEntity.programmeInitials.trim().toUpperCase(),
            deptEntity.deptProgrammeInitials.trim().toUpperCase() === currentProgrammeEntity.programmeInitials.trim().toUpperCase());
          if (deptEntity.deptProgrammeInitials.trim().toUpperCase() === currentProgrammeEntity.programmeInitials.trim().toUpperCase()) {
            //don't add to final list
          } else {
            programInitialsMatchCount++;//increment this by 1
          }
        }

        if (programInitialsMatchCount > 0) {
          finalProgrammeGroupEntities.push(currentProgrammeEntity);
        }
      }
      console.log('Incoming programmeGroup=>', programmeGroupEntities);
      console.log('Filtered programmeGroups(removal of already set Departments with programmeInitials)=>', finalProgrammeGroupEntities);
      return finalProgrammeGroupEntities;
    }
  }
}
