import {GeneralResponsePayload} from "./general-response-payload";
import {DepartmentEntity} from "./department-entity";
export class DepartmentResponsePayload extends GeneralResponsePayload{

  constructor(status: number, message: string, responseObject:DepartmentEntity) {
    super(status, message, responseObject);
  }
}
