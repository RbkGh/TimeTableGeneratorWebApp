/**
 * Created by Rodney on 05-Jan-17.
 */
export class GeneralResponsePayload{

  public status : number;
  public message : String;


  constructor(status: number, message: String) {
    this.status = status;
    this.message = message;
  }
}
