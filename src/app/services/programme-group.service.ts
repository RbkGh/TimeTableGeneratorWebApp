import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers, Response} from "@angular/http";
import {ProgrammeGroupResponsePayload} from "../models/programme-group-response-payload";
import {Observable} from "rxjs";
import {UrlEndpoints} from "../helpers/url-endpoints";
import {ProgrammeGroupEntity} from "../models/programme-group-entity";
import {ProgrammeGroupArrayResponsePayload} from "../models/programme-group-array-response-payload";

@Injectable()
export class ProgrammeGroupService {

  constructor(private http: Http) {
  }

  createProgrammeGroup(programmeGroupEntities: Array<ProgrammeGroupEntity>): Observable<ProgrammeGroupResponsePayload> {
    let createProgrammeGroupUrl = UrlEndpoints.PROGRAMME_GROUP_ENDPOINT;
    let body = programmeGroupEntities;
    let headers = new Headers({'Content-Type': 'application/json'}); // ... Set content type to JSON
    let options = new RequestOptions({headers: headers});
    return this.http.post(createProgrammeGroupUrl, body, options)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  getProgrammeGroup(id: string): Observable<ProgrammeGroupResponsePayload> {
    let getProgrammeGroupUrl = UrlEndpoints.PROGRAMME_GROUP_ENDPOINT + '/' + id;
    return this.http.get(getProgrammeGroupUrl, {})
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  getProgrammeGroupByYearGroupNumber(yearGroupNo: number): Observable<ProgrammeGroupArrayResponsePayload> {
    let getProgrammeGroupByYearGroupNumberUrl = UrlEndpoints.PROGRAMME_GROUP_ENDPOINT + '?yearGroupNo=' + yearGroupNo;
    return this.http.get(getProgrammeGroupByYearGroupNumberUrl, {})
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  getAllProgrammeGroups(): Observable<ProgrammeGroupArrayResponsePayload> {
    let getAllProgrammeGroupsUrl = UrlEndpoints.PROGRAMME_GROUP_ENDPOINT;
    return this.http.get(getAllProgrammeGroupsUrl, {})
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  deleteProgrammeGroup(id: string): Observable<ProgrammeGroupResponsePayload> {
    let deleteProgrammeGroupUrl = UrlEndpoints.PROGRAMME_GROUP_ENDPOINT + '/' + id;
    return this.http.delete(deleteProgrammeGroupUrl, {})
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  updateProgrammeGroup(id:string,programmeGroupEntity:ProgrammeGroupEntity): Observable<ProgrammeGroupResponsePayload> {
    let updateProgrammeGroupUrl = UrlEndpoints.PROGRAMME_GROUP_ENDPOINT ;
    let body = programmeGroupEntity;
    let headers = new Headers({'Content-Type': 'application/json'}); // ... Set content type to JSON
    let options = new RequestOptions({headers: headers});
    return this.http.put(updateProgrammeGroupUrl, body,options)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }
}
