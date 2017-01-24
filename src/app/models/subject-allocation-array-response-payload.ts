import {GeneralResponsePayload} from "./general-response-payload";
import {SubjectAllocationEntity} from "./subject-allocation-entity";
export class SubjectAllocationArrayResponsePayload extends GeneralResponsePayload{
  constructor(status: number, message: string, responseObject:Array<SubjectAllocationEntity>) {
    super(status, message, responseObject);
  }
}
