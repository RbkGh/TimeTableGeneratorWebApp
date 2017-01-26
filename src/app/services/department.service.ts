import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {DepartmentEntity} from "../models/department-entity";
import {UrlEndpoints} from "../helpers/url-endpoints";

@Injectable()
export class DepartmentService {

  constructor(private http:Http) { }

//   @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
//   private OutgoingPayload createDepartment(@RequestBody DepartmentDoc departmentDoc) {
//   if (departmentDoc.getDeptHODdeputyTutorCode() != "" || departmentDoc.getDeptHODdeputyTutorCode() != null) {
//   DepartmentDoc departmentDocSavedInDb = departmentDocRepository.save(departmentDoc);
//   return new SuccessfulOutgoingPayload(departmentDocSavedInDb);
// } else {
//   return new ErrorOutgoingPayload("HOD for the Department must be set");
// }
// }
  createDepartment(departmentEntity:DepartmentEntity):void{
    let createDeptEndpoint = UrlEndpoints.DEPARTMENT_ENDPOINT;
    return
  }

}
