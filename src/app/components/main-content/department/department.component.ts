import {Component, OnInit} from "@angular/core";
import {DepartmentService} from "../../../services/department.service";
import {TutorService} from "../../../services/tutor.service";
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
  noOfDepartments:number;
  isDepartmentsListEmpty:boolean=false;

  constructor(public departmentService:DepartmentService,
              public tutorService:TutorService) { }

  ngOnInit() {
    this.getAllDepartments();
  }

  getAllDepartments():void{
    this.departmentService.getAllDepartments().subscribe(
      r=>{
        if(r.status===0) {
          this.departments = r.responseObject;
          this.noOfDepartments = r.responseObject.length;
          if (r.responseObject.length === 0) {
            this.isDepartmentsListEmpty = true;
          }else{
            this.isDepartmentsListEmpty = false;
          }
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
