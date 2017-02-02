import {GeneralResponsePayload} from "./general-response-payload";
import {ProgrammeGroupEntity} from "./programme-group-entity";
export class ProgrammeGroupResponsePayload extends GeneralResponsePayload{

  constructor(status: number, message: string, responseObject:ProgrammeGroupEntity) {
    super(status, message, responseObject);
  }
}
