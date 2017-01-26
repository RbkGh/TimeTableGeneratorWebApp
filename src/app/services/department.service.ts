import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {DepartmentEntity} from "../models/department-entity";
import {UrlEndpoints} from "../helpers/url-endpoints";
import {Observable} from "rxjs";
import {DepartmentResponsePayload} from "../models/department-response-payload";
import {DepartmentArrayRepsponsePayload} from "../models/department-array-repsponse-payload";

@Injectable()
export class DepartmentService {

  constructor(private http: Http) {
  }

  createDepartment(departmentEntity: DepartmentEntity): Observable<DepartmentResponsePayload> {
    let createDeptEndpoint = UrlEndpoints.DEPARTMENT_ENDPOINT;
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(createDeptEndpoint, departmentEntity, options).map(
      (response: Response) => response.json())
      .catch((e: any) => Observable.throw(e.json() || "server Error"));
  }

  addTutorToDepartment(departmentId: string, tutorId: string): Observable<DepartmentResponsePayload> {
    let addTutorEndpoint = UrlEndpoints.DEPARTMENT_ENDPOINT + '/tutor/' + departmentId + '?tutorId=' + tutorId;
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = {};
    return this.http.post(addTutorEndpoint, body, options).map(
      (response: Response) => response.json())
      .catch((e: any) => Observable.throw(e.json() || "server Error"));
  }

  addTutorsToDepartment(departmentId: string, tutorIds: Array<string>): Observable<DepartmentArrayRepsponsePayload> {
    let addTutorsEndpoint = UrlEndpoints.DEPARTMENT_ENDPOINT + '/tutors/' + departmentId;
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = tutorIds;
    return this.http.post(addTutorsEndpoint, body, options).map(
      (response: Response) => response.json())
      .catch((e: any) => Observable.throw(e.json() || "server Error"));
  }

  getAllDepartments(): Observable<DepartmentArrayRepsponsePayload> {
    let getAllDepartmentsEndpoint = UrlEndpoints.DEPARTMENT_ENDPOINT;
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.get(getAllDepartmentsEndpoint, options).map(
      (response: Response) => response.json())
      .catch((e: any) => Observable.throw(e.json() || "server Error"));
  }

  getAllTutorsByDepartmentId(departmentId: string): Observable<DepartmentArrayRepsponsePayload> {
    let getAllTutorsByDeptIdEndpoint = UrlEndpoints.DEPARTMENT_ENDPOINT + '/tutors/' + departmentId;
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.get(getAllTutorsByDeptIdEndpoint, options).map(
      (response: Response) => response.json())
      .catch((e: any) => Observable.throw(e.json() || "server Error"));
  }

  updateDepartment(departmentEntity: DepartmentEntity): Observable<DepartmentResponsePayload> {
    let updateDeptEndpoint = UrlEndpoints.DEPARTMENT_ENDPOINT + '/' + departmentEntity.id;
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.put(updateDeptEndpoint, departmentEntity, options).map(
      (response: Response) => response.json())
      .catch((e: any) => Observable.throw(e.json() || "server Error"));
  }

  /**
   * id of department
   * @param id
   * @returns {Observable<R>}
   */
  deleteDepartment(id: string): Observable<DepartmentResponsePayload> {
    let deleteDeptEndpoint = UrlEndpoints.DEPARTMENT_ENDPOINT + '/' + id;
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.delete(deleteDeptEndpoint, options).map(
      (response: Response) => response.json())
      .catch((e: any) => Observable.throw(e.json() || "server Error"));
  }

  deleteAllDepartments(): Observable<DepartmentResponsePayload> {
    let deleteAllDeptsEndpoint = UrlEndpoints.DEPARTMENT_ENDPOINT;
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.delete(deleteAllDeptsEndpoint, options).map(
      (response: Response) => response.json())
      .catch((e: any) => Observable.throw(e.json() || "server Error"));
  }

  deleteTutorByDepartmentId(departmentId: string, tutorId: string): Observable<DepartmentResponsePayload> {
    let deleteTutorByDeptIdEndpoint = UrlEndpoints.DEPARTMENT_ENDPOINT + '/tutor/' + departmentId + '?' + 'tutorId=' + tutorId;
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.delete(deleteTutorByDeptIdEndpoint, options).map(
      (response: Response) => response.json())
      .catch((e: any) => Observable.throw(e.json() || "server Error"));
  }

  deleteAllTutorsByDepartmentId(departmentId: string): Observable<DepartmentResponsePayload> {
    let deleteAllTutorsByDeptIdEndpoint = UrlEndpoints.DEPARTMENT_ENDPOINT + '/tutors/' + departmentId;
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.delete(deleteAllTutorsByDeptIdEndpoint, options).map(
      (response: Response) => response.json())
      .catch((e: any) => Observable.throw(e.json() || "server Error"));
  }

}
