import {SubjectEntity} from "./subject-entity";
import {GeneralResponsePayload} from "./general-response-payload";
export class SubjectsArrayDefaultResponsePayload extends GeneralResponsePayload {

  constructor(status: number, message: string, responseObject: Array<SubjectEntity>) {
    super(status, message, responseObject);
  }

}

