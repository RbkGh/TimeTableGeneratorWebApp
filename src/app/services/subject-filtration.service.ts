import {Injectable} from '@angular/core';
import {SubjectEntity} from "../models/subject-entity";
import {DepartmentEntity} from "../models/department-entity";
import {doesIntersect} from "tslint";

@Injectable()
export class SubjectFiltrationService {

  constructor() {
  }

  /**
   * TODO nOT FULLY WORKING--Remove all subjects that have been assigned a department already,and return list
   * @param subjects
   * @param departmentEntities
   * @returns {Array<SubjectEntity>}
   */
  filterSubjectsThatHaveBeenAssignedADepartment(subjects: Array<SubjectEntity>, departmentEntities: Array<DepartmentEntity>): Array<SubjectEntity> {
    if (subjects.length === 0 || departmentEntities.length === 0) {
      return subjects; //no need for filtration
    } else {
      let finalSortedSubjects: Array<SubjectEntity> = [];
      for (let i: number = 0; i < subjects.length; i++) {
        let currentSubject: SubjectEntity = subjects[i];
        if (this.doesSubjectExistOnAnyDepartmentAvailable(currentSubject, departmentEntities) === false) {
          finalSortedSubjects.push(currentSubject);
        }
      }
      console.log('Incoming Subjects=>', subjects);
      console.log('Filtered Subjects ie Removal of Subjects That have already been assigned=>', finalSortedSubjects);
      return finalSortedSubjects;
    }
  }

  protected doesSubjectExistOnAnyDepartmentAvailable(subjectEntity: SubjectEntity, departmentEntities: Array<DepartmentEntity>): boolean {
    let subjectEntityIdToCompareDepartmentEntitiesAgainst: string = subjectEntity.id;
    let doesSubjectExistOnAnyDepartmentAvailable = false;
    for (let i: number = 0; i < departmentEntities.length; i++) {
      let currentDepartment: DepartmentEntity = departmentEntities[i];
      let currentProgrammeSubjectsDocIdList: Array<string> = currentDepartment.programmeSubjectsDocIdList;
      for (let iCurrDept: number = 0; iCurrDept < currentProgrammeSubjectsDocIdList.length; iCurrDept++) {
        doesSubjectExistOnAnyDepartmentAvailable = false;//reset to false always before the check.
        let currentProgrammeSubjectsDocId: string = currentProgrammeSubjectsDocIdList[iCurrDept];
        if (subjectEntityIdToCompareDepartmentEntitiesAgainst.trim().toUpperCase() === currentProgrammeSubjectsDocId.trim().toUpperCase()) {
          doesSubjectExistOnAnyDepartmentAvailable = true;
          break;//break out of loop since found
        }
      }
      //if value is true,then break out of loop and return true
      if (doesSubjectExistOnAnyDepartmentAvailable === true) {
        doesSubjectExistOnAnyDepartmentAvailable = true;//useless but my mind is tired,so i set this for assurance
        break;
      }
    }
    return doesSubjectExistOnAnyDepartmentAvailable;
  }
}
