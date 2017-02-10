import {GeneralResponsePayload} from "./general-response-payload";
import {SubjectEntity} from "./subject-entity";
import {SubjectService} from "../services/subject.service";
import {SubjectEntityWithExtraInfo} from "./subject-entity-with-extra-info";

/**
 * use this when expecting an Array of Subjects ,eg when accessing the {@link SubjectService.getAllSubjects} resource
 */
export class SubjectsArrayCustomResponsePayload extends GeneralResponsePayload {

  constructor(status: number, message: string, responseObject:Array<SubjectEntityWithExtraInfo>) {
    super(status, message, responseObject);
  }

}
