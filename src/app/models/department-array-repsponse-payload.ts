import {GeneralResponsePayload} from "./general-response-payload";
import {DepartmentEntity} from "./department-entity";
export class DepartmentArrayRepsponsePayload extends GeneralResponsePayload {

  constructor(status: number, message: string, responseObject: Array<DepartmentEntity>) {
    super(status, message, responseObject);
  }
}
