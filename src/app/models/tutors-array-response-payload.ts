import {Tutor} from "./TutorResponsePayload";
import {GeneralResponsePayload} from "./general-response-payload";
export class TutorsArrayResponsePayload extends GeneralResponsePayload{

  constructor(public status: number, public message: string, public responseObject: Array<Tutor>) {
    super(status, message,responseObject);
  }
}
