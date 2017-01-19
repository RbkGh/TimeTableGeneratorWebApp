import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {SubjectsArrayResponsePayload} from "../models/subjects-array-response-payload";
import {UrlEndpoints} from "../helpers/url-endpoints";

@Injectable()
export class SubjectAllocationService {

  constructor(private http: Http) {
  }

  getAllSubjectsAllocationState(): Observable<SubjectsArrayResponsePayload> {
    let allSubjectsAllocationStateEndpoint = UrlEndpoints.SUBJECT_ALLOCATION_ENDPOINT + "/state";
    return this.http.get(allSubjectsAllocationStateEndpoint, {}).map
    ((response: Response) => response.json() as SubjectsArrayResponsePayload)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}
