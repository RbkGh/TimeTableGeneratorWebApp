import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {UrlEndpoints} from "../helpers/url-endpoints";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {TutorResponsePayload} from "../models/TutorResponsePayload";

@Injectable()
export class TutorService {

  constructor(private router: Router,
              private urlEndpoints: UrlEndpoints,
              private http: Http) {
  }

  getAllTutors() : Observable<TutorResponsePayload>{
    let headers = new Headers({'Content-Type': 'application/json'}); // ... Set content type to JSON
    let options = new RequestOptions({headers: headers});
    return this.http.get(this.urlEndpoints.TUTOR_ENDPOINT.toString(),options)
      .map((response: Response) =>response.json() as TutorResponsePayload) //...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
  }

}
