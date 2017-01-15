import {GeneralResponsePayload} from "./general-response-payload";
import {SubjectEntity} from "./subject-entity";
import {SubjectService} from "../services/subject.service";

/**
 * use this when expecting an Array of Subjects ,eg when accessing the {@link SubjectService.getAllSubjects} resource
 */
export class SubjectsArrayResponsePayload extends GeneralResponsePayload{

  constructor(status: number, message: string, responseObject:Array<SubjectEntity>) {
    super(status, message, responseObject);
  }

}
