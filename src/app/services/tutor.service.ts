import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {UrlEndpoints} from "../helpers/url-endpoints";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {TutorResponsePayload} from "../models/TutorResponsePayload";
import {GeneralResponsePayload} from "../models/general-response-payload";

@Injectable()
export class TutorService {

  constructor(private router: Router,
              private http: Http) {
  }

  public getAllTutors(): Observable<TutorResponsePayload> {
    //let headers = new Headers({'Content-Type': 'application/json'}); // ... Set content type to JSON
    //let options = new RequestOptions({headers: headers});
    let tutorEndpoint = UrlEndpoints.TUTOR_ENDPOINT;
    return this.http.get(tutorEndpoint, {})
      .map((response: Response) => response.json() as TutorResponsePayload) //...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
  }

  public deleteTutor(id: string): Observable<GeneralResponsePayload> {
    let deleteTutorEndpoint = UrlEndpoints.TUTOR_ENDPOINT + "/" + id;
    console.log("delete endpoint = "+deleteTutorEndpoint);
    return this.http.delete(deleteTutorEndpoint, {}).map(
      (response: Response) => response.json() as GeneralResponsePayload
    ).catch(
      (error: any) => Observable.throw(error.json().error || 'Server Error')
    );
  }

}
