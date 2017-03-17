/**
 * Created by Rodney on 05-Jan-17.
 */
export class GeneralResponsePayload{

  /**
   *
   * @param status
   * @param message
   * @param responseObject
   */
  constructor(public status: number, public message: string,public responseObject) {

  }
}
