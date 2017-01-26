import {Component, OnInit, ViewChild} from "@angular/core";
import {DepartmentService} from "../../../services/department.service";
import {TutorService} from "../../../services/tutor.service";
import {DepartmentEntity} from "../../../models/department-entity";
import {ModalComponent} from "ng2-bs3-modal/components/modal";
import {FormGroup, FormBuilder, FormControl, Validators} from "@angular/forms";

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

  formIsValid:boolean;
  addDeptForm:FormGroup;

  @ViewChild('modalAddDept')
  modalAddDept: ModalComponent;

  constructor(public departmentService:DepartmentService,
              public tutorService:TutorService,
              public formBuilder:FormBuilder) { }

  ngOnInit() {
    this.getAllDepartments();
    this.buildAddDeptForm();
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


  buildAddDeptForm():void{
    this.addDeptForm = this.formBuilder.group({});
    this.addDeptForm.addControl('deptName',new FormControl('',Validators.required));

    this.addDeptForm.valueChanges
      .subscribe(data => this.onAddDeptFormValueChanged(data));
    this.onAddDeptFormValueChanged(); // (re)set validation messages now
  }

  onAddDeptFormValueChanged(data?: any): void {
    if (!this.addDeptForm) {
      return;
    }
    const form = this.addDeptForm;

    for (const field in this.formErrors) {
      // clear previous error message and styling (if any)
      this.formErrors[field] = '';
      this.formIsValid = false;

      const control = form.get(field);
      //if form is touched,dirty, and if the control is invalid,per validation rule,
      if (control && control.dirty && !control.valid) {

        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
          this.formIsValid = false;
        }
      } else {
        this.formIsValid = true;
      }
    }
  }


  formErrors = {
    'deptName': ''
  };
  validationMessages = {
    'deptName': {
      'required': 'Department Name is required.'
    }
  };

  openAddDepartmentModal(){
    this.modalAddDept.open();
  }

}
