import {GeneralResponsePayload} from "./general-response-payload";
/**
 * Created by Rodney on 05-Jan-17.
 */
export class TutorResponsePayload extends GeneralResponsePayload {


  constructor(public status: number, public message: string, public responseObject: Tutor) {
    super(status, message,responseObject);
  }

}

export class Tutor {

  constructor(public id:string,
              public firstName: string,
              public surName: string,
              public otherNames: string,
              public phoneNumber: string,
              public emailAddress: string,
              public tutorCode: string,
              public minPeriodLoad: number,
              public maxPeriodLoad: number,
              public assignedYearGroup: string,
              public tutorSubjectSpeciality: string) {

  }
}

