import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {SubjectResponsePayload} from "../models/subject-response-payload";
import {UrlEndpoints} from "../helpers/url-endpoints";
import {Response, Http, Headers, RequestOptions} from "@angular/http";
import {SubjectsArrayResponsePayload} from "../models/subjects-array-response-payload";
import {SubjectEntity} from "../models/subject-entity";

@Injectable()
export class SubjectService {

  constructor(private http: Http) {
  }

  getAllSubjects(): Observable<SubjectsArrayResponsePayload> {
    let tutorEndpoint = UrlEndpoints.SUBJECT_ENDPOINT;
    return this.http.get(tutorEndpoint, {})
      .map((response: Response) => response.json() as SubjectsArrayResponsePayload)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  public deleteSubject(id: string): Observable<SubjectResponsePayload> {
    let subjectEndpoint = UrlEndpoints.SUBJECT_ENDPOINT + "/" + id;
    console.log("delete subject endpoint = " + subjectEndpoint);
    return this.http.delete(subjectEndpoint, {}).map(
      (response: Response) => response.json() as SubjectResponsePayload
    ).catch(
      (error: any) => Observable.throw(error.json().error || 'Server Error')
    );
  }

  public createSubject(subjectJsonObject: SubjectEntity): Observable<SubjectResponsePayload> {
    let headers = new Headers({'Content-Type': 'application/json'}); // ... Set content type to JSON
    let options = new RequestOptions({headers: headers});
    let createSubjectEndpoint = UrlEndpoints.SUBJECT_ENDPOINT;
    return this.http.post(createSubjectEndpoint, subjectJsonObject, options)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  public deleteAllSubjects(): Observable<SubjectResponsePayload> {
    let headers = new Headers({'Content-Type': 'application/json'}); // ... Set content type to JSON
    let options = new RequestOptions({headers: headers});
    let deleteAllSubjectsEndpoint = UrlEndpoints.SUBJECT_ENDPOINT;
    return this.http.delete(deleteAllSubjectsEndpoint, options)
      .map((response: Response) => response.json())
      .catch((e: any) => Observable.throw(e.json() || "server Error"));
  }

  public updateSubject(subjectId: string, subjectJsonObjToBeUpdated: SubjectEntity): Observable<SubjectResponsePayload> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = subjectJsonObjToBeUpdated;
    let updateSubjectEndpoint = UrlEndpoints.SUBJECT_ENDPOINT + "/" + subjectId;
    return this.http.put(updateSubjectEndpoint, body, options)
      .map((response: Response) => response.json())
      .catch((e: any) => Observable.throw(e.json() || "server Error"));
  }
}
