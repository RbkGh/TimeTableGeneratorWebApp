import {Injectable} from "@angular/core";
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {UrlEndpoints} from "../helpers/url-endpoints";
import {Observable} from "rxjs";
import {TutorResponsePayload, Tutor} from "../models/TutorResponsePayload";
import {GeneralResponsePayload} from "../models/general-response-payload";

@Injectable()
export class TutorService {

  constructor(private http: Http) {
  }

  public getAllTutors(): Observable<TutorResponsePayload> {
    let tutorEndpoint = UrlEndpoints.TUTOR_ENDPOINT;
    return this.http.get(tutorEndpoint, {})
      .map((response: Response) => response.json() as TutorResponsePayload)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  public deleteTutor(id: string): Observable<GeneralResponsePayload> {
    let deleteTutorEndpoint = UrlEndpoints.TUTOR_ENDPOINT + "/" + id;
    console.log("delete endpoint = " + deleteTutorEndpoint);
    return this.http.delete(deleteTutorEndpoint, {}).map(
      (response: Response) => response.json() as GeneralResponsePayload
    ).catch(
      (error: any) => Observable.throw(error.json().error || 'Server Error')
    );
  }

  public createTutor(tutorJsonObject: Tutor): Observable<TutorResponsePayload> {
    let headers = new Headers({'Content-Type': 'application/json'}); // ... Set content type to JSON
    let options = new RequestOptions({headers: headers});
    let createTutorEndpoint = UrlEndpoints.TUTOR_ENDPOINT;
    return this.http.post(createTutorEndpoint, tutorJsonObject, options).map((response: Response) => response.json()).catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

}
