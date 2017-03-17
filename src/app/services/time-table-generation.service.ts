import {Injectable} from "@angular/core";
import {Http, RequestOptions, Headers, Response} from "@angular/http";
import {Observable} from "rxjs";
import {UrlEndpoints} from "../helpers/url-endpoints";
import {TimeTableGenerationRequest} from "../models/time-table-generation-request";
import {TimeTableMainEntityResponsePayload} from "../models/time-table-main-entity-response-payload";
import {TimeTableMainEntityArrayResponsePayload} from "../models/time-table-main-entity-array-response-payload";

@Injectable()
export class TimeTableGenerationService {

  constructor(private http : Http) { }

  generateTimeTable(timetableGenerationRequest: TimeTableGenerationRequest): Observable<TimeTableMainEntityResponsePayload> {
    let timeTableGenerationEndpoint:string = UrlEndpoints.TIMETABLE_GENERATION_ENDPOINT;
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(timeTableGenerationEndpoint, timetableGenerationRequest, options).map(
      (response: Response) => response.json())
      .catch((e: any) => Observable.throw(e.json() || "server Error"));
  }

  getAllGeneratedTimeTables(): Observable<TimeTableMainEntityArrayResponsePayload> {
    let timeTableGenerationEndpoint = UrlEndpoints.TIMETABLE_GENERATION_ENDPOINT;
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.get(timeTableGenerationEndpoint, options).map(
      (response: Response) => response.json())
      .catch((e: any) => Observable.throw(e.json() || "server Error"));
  }

}
