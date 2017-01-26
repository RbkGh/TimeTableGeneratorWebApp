import { Component, OnInit } from '@angular/core';
import {DepartmentService} from "../../../services/department.service";
import {TutorService} from "../../../services/tutor.service";
import {Observable} from "rxjs";
import {DepartmentArrayRepsponsePayload} from "../../../models/department-array-repsponse-payload";
import {DepartmentEntity} from "../../../models/department-entity";

declare var swal:any;
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
  providers : [DepartmentService,TutorService]
})
export class DepartmentComponent implements OnInit {

  departments:Array<DepartmentEntity>;

  constructor(public departmentService:DepartmentService,
              public tutorService:TutorService) { }

  ngOnInit() {
  }

  getAllDepartments():void{
    this.departmentService.getAllDepartments().subscribe(
      r=>{
        if(r.status===0) {
          this.departments = r.responseObject;
        }else{
          swal("Error",r.message,"error");
        }
      },
      e=>{
        swal("Error","Ensure you have a working internet connection,other wise try again later.","error");
      }
    )
  }

}
