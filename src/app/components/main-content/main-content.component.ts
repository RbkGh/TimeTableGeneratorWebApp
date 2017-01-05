import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {TutorComponent} from "./tutor/tutor.component";
import {ProgrammeGroupComponent} from "./programme-group/programme-group.component";
import {SubjectComponent} from "./subject/subject.component";
import {DepartmentComponent} from "./department/department.component";
import {TimeTableComponent} from "./time-table/time-table.component";

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css'],
  viewProviders : [
    TutorComponent,
    ProgrammeGroupComponent,
    SubjectComponent,
    DepartmentComponent,
    TimeTableComponent
    ]
})
export class MainContentComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
    //default
    this.router.navigate([('home/tutor')]);
  }

}
