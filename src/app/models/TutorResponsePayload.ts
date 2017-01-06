import {GeneralResponsePayload} from "./general-response-payload";
/**
 * Created by Rodney on 05-Jan-17.
 */
export class TutorResponsePayload extends GeneralResponsePayload{

  public responseObject : any;

  constructor(status: number, message: String) {
    super(status, message);
  }

}
