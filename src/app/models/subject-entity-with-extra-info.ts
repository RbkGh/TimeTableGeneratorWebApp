import {SubjectAllocationEntity} from "./subject-allocation-entity";
import {SubjectEntity} from "./subject-entity";
export class SubjectEntityWithExtraInfo {
  constructor(public subjectAllocationDocs:Array<SubjectAllocationEntity>,public subjectDoc: SubjectEntity){}
}
