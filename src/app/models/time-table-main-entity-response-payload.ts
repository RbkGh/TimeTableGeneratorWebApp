import {GeneralResponsePayload} from "./general-response-payload";
import {TimeTableMainEntity} from "./time-table-main-entity";
export class TimeTableMainEntityResponsePayload extends GeneralResponsePayload {


  constructor(status: number, message: string, responseObject: TimeTableMainEntity) {
    super(status, message, responseObject);
  }
}
