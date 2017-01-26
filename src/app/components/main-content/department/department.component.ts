import { Component, OnInit } from '@angular/core';
import {DepartmentService} from "../../../services/department.service";
import {TutorService} from "../../../services/tutor.service";

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
  providers : [DepartmentService,TutorService]
})
export class DepartmentComponent implements OnInit {

  constructor(public departmentService:DepartmentService,
              public tutorService:TutorService) { }

  ngOnInit() {
  }

}
