import {GeneralResponsePayload} from "./general-response-payload";
import {TimeTableMainEntity} from "./time-table-main-entity";
/**
 * array of {@link TimeTableMainEntity} payload
 */
export class TimeTableMainEntityArrayResponsePayload extends GeneralResponsePayload {

  constructor(status: number, message: string, responseObject: Array<TimeTableMainEntity>) {
    super(status, message, responseObject);
  }
}
