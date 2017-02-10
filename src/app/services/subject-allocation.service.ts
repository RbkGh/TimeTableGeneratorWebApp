import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {SubjectsArrayCustomResponsePayload} from "../models/subjects-array-response-payload";
import {UrlEndpoints} from "../helpers/url-endpoints";
import {GeneralResponsePayload} from "../models/general-response-payload";
import {SubjectAllocationEntity} from "../models/subject-allocation-entity";
import {SubjectAllocationArrayResponsePayload} from "../models/subject-allocation-array-response-payload";

@Injectable()
export class SubjectAllocationService {

  constructor(private http: Http) {
  }

  updateSubjectAllocation(subjectAllocationEntity:SubjectAllocationEntity):Observable<GeneralResponsePayload>{
    let updateSubjectAllocationEndpoint:string = UrlEndpoints.SUBJECT_ALLOCATION_ENDPOINT;
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = subjectAllocationEntity;
    return this.http.put(updateSubjectAllocationEndpoint,body,options).map(
      (response:Response) =>response.json() as GeneralResponsePayload
    ).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateMultipleSubjectAllocation(subjectAllocationEntities:Array<SubjectAllocationEntity>):Observable<GeneralResponsePayload>{
    let updateSubjectAllocationEndpoint:string = UrlEndpoints.SUBJECT_ALLOCATION_ENDPOINT+"/multiple";
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = subjectAllocationEntities;
    return this.http.put(updateSubjectAllocationEndpoint,body,options).map(
      (response:Response) =>response.json() as GeneralResponsePayload
    ).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getSubjectAllocationsForSubject(id: string): Observable<SubjectsArrayCustomResponsePayload> {
    let subjectAllocationsForSubjectEndpoint = UrlEndpoints.SUBJECT_ALLOCATION_ENDPOINT + "/"+id;
    return this.http.get(subjectAllocationsForSubjectEndpoint, {}).map
    ((response: Response) => response.json() as SubjectAllocationArrayResponsePayload)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getAllSubjectsAllocationState(): Observable<SubjectsArrayCustomResponsePayload> {
    let allSubjectsAllocationStateEndpoint = UrlEndpoints.SUBJECT_ALLOCATION_ENDPOINT + "/state";
    return this.http.get(allSubjectsAllocationStateEndpoint, {}).map
    ((response: Response) => response.json() as SubjectsArrayCustomResponsePayload)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}
