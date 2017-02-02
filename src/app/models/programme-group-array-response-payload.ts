import {GeneralResponsePayload} from "./general-response-payload";
import {ProgrammeGroupEntity} from "./programme-group-entity";
export class ProgrammeGroupArrayResponsePayload extends GeneralResponsePayload{

  constructor(status: number, message: string, responseObject:Array<ProgrammeGroupEntity>) {
    super(status, message, responseObject);
  }
}
