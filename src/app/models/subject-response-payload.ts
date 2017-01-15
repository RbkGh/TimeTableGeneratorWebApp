import {GeneralResponsePayload} from "./general-response-payload";
import {SubjectEntity} from "./subject-entity";
export class SubjectResponsePayload extends GeneralResponsePayload{


  constructor(status: number, message: string, responseObject:SubjectEntity) {
    super(status, message, responseObject);
  }
}
