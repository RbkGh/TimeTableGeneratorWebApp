import {Component, OnInit, ViewChild} from "@angular/core";
import {DepartmentService} from "../../../services/department.service";
import {TutorService} from "../../../services/tutor.service";
import {DepartmentEntity} from "../../../models/department-entity";
import {ModalComponent} from "ng2-bs3-modal/components/modal";
import {FormGroup, FormBuilder, FormControl, Validators} from "@angular/forms";
import {Tutor} from "../../../models/TutorResponsePayload";
import {TutorsArrayResponsePayload} from "../../../models/tutors-array-response-payload";
import {DepartmentResponsePayload} from "../../../models/department-response-payload";

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
  isTutorsListEmpty:boolean=false;
  addDeptForm:FormGroup;

  tutors:Array<Tutor>;
  tutorNames:Array<any>;

  @ViewChild('modalAddDept')
  modalAddDept: ModalComponent;
  deptHODtutorId:string;

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

  getAllTutorsToAddToDept():void{
    this.tutorService.getAllTutors()
      .subscribe(
        (response:TutorsArrayResponsePayload)=>{
          if(response.status === 0) {
            if(response.responseObject.length ===0) {
              this.modalAddDept.dismiss();
              this.isTutorsListEmpty = true;
              swal("No Tutors Created","Kindly add the H.O.D to the tutors first.","error");
            }else{
              console.log("Tutors to add to department=",response.responseObject);
              this.tutors = response.responseObject;
              this.tutorNames = this.getTutorNames(response.responseObject);
            }
          }else{
            swal("Error",response.message,"error");
          }
        },
        error=>{
          swal("Error","Something went wrong","error");
        }
      )
  }

  getTutorNames(tutors:Array<Tutor>):Array<any>{
    let tutorNamesStrings:Array<any>=[];
    for(let i:number =0; i< tutors.length;i++ ){
      tutorNamesStrings[i]={
        id:tutors[i].id,
        text:tutors[i].firstName+' '+tutors[i].surName
      };
    }
    return tutorNamesStrings;
  }

  addDepartment(addDeptForm:FormGroup):void{
    let departmentEntity:DepartmentEntity =new DepartmentEntity(
      null,addDeptForm.value.deptName,this.deptHODtutorId,'');
    // departmentEntity.deptHODtutorCode = this.deptHODtutorId;
    // departmentEntity.deptName = addDeptForm.value.deptName;

    this.departmentService.createDepartment(departmentEntity).subscribe(
      (r:DepartmentResponsePayload)=>{
        if(r.status===0) {
          this.modalAddDept.dismiss();
          swal("Success","Department Added Successfully","success");
        }else{
          swal("Error",r.message,"error");
        }
      },
      (error:any)=>{
        swal("Error","Something went wrong,please Try Again","error");
      }
    );
  }

  public selectedHOD(value:any):void {
    console.log('Selected value is: ', value);
    this.deptHODtutorId = value;
  }
  public refreshValue(value:any):void {
    //this.value = value;
    console.log('Data =',value);
  }
  public typedHODName(value:any):void {
    console.log('New search input: ', value);
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
    this.getAllTutorsToAddToDept();
  }

}
