import {Component, OnInit, ViewChild} from "@angular/core";
import {DepartmentService} from "../../../services/department.service";
import {TutorService} from "../../../services/tutor.service";
import {DepartmentEntity} from "../../../models/department-entity";
import {ModalComponent} from "ng2-bs3-modal/components/modal";
import {FormGroup, FormBuilder, FormControl, Validators} from "@angular/forms";
import {Tutor} from "../../../models/TutorResponsePayload";
import {TutorsArrayResponsePayload} from "../../../models/tutors-array-response-payload";
import {DepartmentResponsePayload} from "../../../models/department-response-payload";

declare var swal: any;
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
  providers: [DepartmentService, TutorService]
})
export class DepartmentComponent implements OnInit {

  departments: Array<DepartmentEntity>;
  noOfDepartments: number;
  isDepartmentsListEmpty: boolean = false;
  isTutorsInDeptListEmpty:boolean=false;
  noOfTutorsInDept:number;

  formIsValid: boolean;
  isTutorsListEmpty: boolean = false;
  addDeptForm: FormGroup;
  addTutorToDeptForm:FormGroup;
  updateDeptForm: FormGroup;
  /**
   * use this to toggle between tutors in dept view and departments only view in template
   * @type {boolean}
   */
  isDeptTutorsViewActive:boolean=false;

  tutorsInDept:Array<Tutor>;
  tutors: Array<Tutor>;
  tutorNames: Array<any>;
  tutorNamesInDept:Array<any>;

  @ViewChild('modalAddDept')
  modalAddDept: ModalComponent;
  @ViewChild('modalUpdateDept')
  modalUpdateDept: ModalComponent;
  @ViewChild('modalAddTutorToDept')
  modalAddTutorToDept: ModalComponent;
  currentDepartmentToUpdate:DepartmentEntity;
  deptHODtutorId: string;
  currentDeptName: string;
  currentDeptId:string;

  constructor(public departmentService: DepartmentService,
              public tutorService: TutorService,
              public formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getAllDepartments();
    this.buildAddDeptForm();
    this.buildUpdateDeptForm();
    this.buildAddTutorToDeptForm();
  }

  getAllDepartments(): void {
    this.departmentService.getAllDepartments().subscribe(
      r => {
        if (r.status === 0) {
          this.departments = r.responseObject;
          this.noOfDepartments = r.responseObject.length;
          if (r.responseObject.length === 0) {
            this.isDepartmentsListEmpty = true;
          } else {
            this.isDepartmentsListEmpty = false;
          }
        } else {
          swal("Error", r.message, "error");
        }
      },
      e => {
        swal("Error", "Ensure you have a working internet connection,other wise try again later.", "error");
      }
    )
  }

  getAllTutorsToAddToDept(): void {
    this.tutorService.getAllTutors()
      .subscribe(
        (response: TutorsArrayResponsePayload) => {
          if (response.status === 0) {
            if (response.responseObject.length === 0) {
              this.modalAddDept.dismiss();
              this.isTutorsListEmpty = true;
              swal("No Tutors Created", "Kindly add the H.O.D to the tutors first.", "error");
            } else {
              console.log("Tutors to add to department=", response.responseObject);
              this.tutors = response.responseObject;
              this.tutorNames = this.getTutorNames(response.responseObject);
            }
          } else {
            swal("Error", response.message, "error");
          }
        },
        error => {
          swal("Error", "Something went wrong", "error");
        }
      )
  }

  /**
   * ng-select library takes data in the form of {id,text} objects.
   * @param tutors
   * @returns {Array<any>}
   */
  getTutorNames(tutors: Array<Tutor>): Array<any> {
    let tutorNamesStrings: Array<any> = [];
    for (let i: number = 0; i < tutors.length; i++) {
      tutorNamesStrings[i] = {
        id: tutors[i].id,
        text: tutors[i].firstName + ' ' + tutors[i].surName
      };
    }
    return tutorNamesStrings;
  }

  addDepartment(addDeptForm: FormGroup): void {
    let deptHODtutorId = this.deptHODtutorId;
    console.log('deptHODtutorId :', deptHODtutorId);
    let departmentEntity: DepartmentEntity = new DepartmentEntity(
      null, addDeptForm.value.deptName, deptHODtutorId, '');
    // departmentEntity.deptHODtutorId = this.deptHODtutorId;
    // departmentEntity.deptName = addDeptForm.value.deptName;

    this.departmentService.createDepartment(departmentEntity).subscribe(
      (r: DepartmentResponsePayload) => {
        if (r.status === 0) {
          this.modalAddDept.dismiss();
          this.ngOnInit();
          swal("Success", "Department Added Successfully", "success");
        } else {
          swal("Error", r.message, "error");
        }
      },
      (error: any) => {
        swal("Error", "Something went wrong,please Try Again", "error");
      }
    );
  }

  updateDepartment(updateDeptForm: FormGroup): void {
    let deptHODtutorId = this.deptHODtutorId;
    let departmentIdToUpdate:string = this.currentDepartmentToUpdate.id;
    console.log('deptHODtutorId :', deptHODtutorId);
    console.log('departmentIdToUpdate :', departmentIdToUpdate);
    console.log('DepartmentNameUpdate  :', updateDeptForm.value.deptNameUpdate);
    let departmentEntity: DepartmentEntity = new DepartmentEntity(
      departmentIdToUpdate, updateDeptForm.value.deptNameUpdate, deptHODtutorId, '');

    this.departmentService.updateDepartment(departmentEntity).subscribe(
      (r: DepartmentResponsePayload) => {
        console.log('Update response =',r);
        if (r.status === 0) {
          this.modalUpdateDept.dismiss();
          this.ngOnInit();
          swal("Success", "Department Updated Successfully", "success");
        } else {
          swal("Error", r.message, "error");
        }
      },
      (error: any) => {
        swal("Error", "Something went wrong,please Try Again", "error");
      }
    );
  }

  deleteDepartment(currentDeptId: string): void {
    console.log("currentDeptId=" + currentDeptId);
    swal({
        title: "Are you sure?",
        text: "This will delete Department Permanently!!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel please!",
        closeOnConfirm: false,
        closeOnCancel: false,
        showLoaderOnConfirm: true
      },
      (isConfirm) => {
        if (isConfirm) {
          /**
           * always use arrow functions otherwise this collides with typescript's this,hence leading to undefined.
           */
          this.departmentService.deleteDepartment(currentDeptId)
            .subscribe(
              (r)=>{
                if(r.status===0){
                  this.ngOnInit();
                  swal("Successful","Department deleted successfully","success");
                }else{
                  swal("Error",r.message,"error");
                }
              },
              error=>{
                swal("Error","Something went wrong.Try again","error");
              }
            );

        } else {
          swal("Cancelled", "Department was not deleted", "error");
        }
      });


  }

  deleteAllDepartments(): void {

    swal({
        title: "Are you sure?",
        text: "This will delete all departments Permanently!!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel please!",
        closeOnConfirm: false,
        closeOnCancel: false,
        showLoaderOnConfirm: true
      },
      (isConfirm) => {
        if (isConfirm) {
          /**
           * always use arrow functions otherwise this collides with typescript's this,hence leading to undefined.
           */
          this.departmentService.deleteAllDepartments()
            .subscribe(
              (r)=>{
                if(r.status===0){
                  this.ngOnInit();
                  swal("Successful","All Departments deleted successfully","success");
                }else{
                  swal("Error",r.message,"error");
                }
              },
              error=>{
                swal("Error","Something went wrong.Try again","error");
              }
            );

        } else {
          swal("Cancelled", "Departments were not deleted", "error");
        }
      });


  }

  public selectedHOD(value: any): void {
    console.log('Selected value is: ', value);
    console.log('value id=', value.id);
    this.deptHODtutorId = value.id;
  }

  public refreshValue(value: any): void {
    //this.value = value;
    console.log('Data =', value);
  }

  public typedHODName(value: any): void {
    console.log('New search input: ', value);
  }

  buildAddDeptForm(): void {
    this.addDeptForm = this.formBuilder.group({});
    this.addDeptForm.addControl('deptName', new FormControl('', Validators.required));

    this.addDeptForm.valueChanges
      .subscribe(data => this.onAddDeptFormValueChanged(data));
    this.onAddDeptFormValueChanged(); // (re)set validation messages now
  }

  buildAddTutorToDeptForm(): void {
    this.addTutorToDeptForm = this.formBuilder.group({});
    //this.addDeptForm.addControl('deptName', new FormControl('', Validators.required));

    //this.addDeptForm.valueChanges
    //  .subscribe(data => this.onAddDeptFormValueChanged(data));
    //this.onAddDeptFormValueChanged(); // (re)set validation messages now
  }

  buildUpdateDeptForm(deptEntity?: DepartmentEntity): void {
    if (typeof deptEntity === "undefined") {
      this.updateDeptForm = this.formBuilder.group({});
      this.updateDeptForm.addControl('deptNameUpdate', new FormControl('', Validators.required));
    } else {
      this.updateDeptForm = this.formBuilder.group({});
      this.updateDeptForm.addControl('deptNameUpdate', new FormControl(deptEntity.deptName, Validators.required));
    }
    this.updateDeptForm.valueChanges
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
    'deptName': '',
    'deptNameUpdate': ''
  };
  validationMessages = {
    'deptName': {
      'required': 'Department Name is required.'
    },
    'deptNameUpdate': {
      'required': 'Department Name is required.'
    }
  };

  openAddDepartmentModal(): void {
    this.modalAddDept.open();
    this.getAllTutorsToAddToDept();
  }

  openEditDepartmentModal(deptEntity: DepartmentEntity): void {
    this.currentDepartmentToUpdate = deptEntity;
    this.modalUpdateDept.open();
    this.buildUpdateDeptForm(deptEntity);
    this.getAllTutorsToAddToDept();
  }

  refreshPage(): void {
    this.ngOnInit();
  }

  activateTutorsInDeptView(departmentEntity:DepartmentEntity):void{
    console.info("DepartmentEntity To Retrieve Tutors : ",departmentEntity);
    this.currentDeptName = departmentEntity.deptName;
    this.currentDeptId = departmentEntity.id;
    this.isDeptTutorsViewActive = true;
    this.getAllTutorsInDepartment(departmentEntity.id);
  }

  getAllTutorsInDepartment(departmentId:string):void{
    this.departmentService.getAllTutorsByDepartmentId(departmentId)
      .subscribe(
        (r)=>{
          if(r.status === 0) {
            if(r.responseObject.length ===0 ) {
              this.isTutorsInDeptListEmpty = true;
            }else{
              this.tutorsInDept = r.responseObject;
              this.noOfTutorsInDept = r.responseObject.length;
              this.tutorNamesInDept = this.getTutorNames(r.responseObject);
            }
          }else{
            swal("Error",r.message,"error");
            this.isDeptTutorsViewActive = false;
          }
        },
        (error)=>{
          swal("Error","Something went wrong.Check your internet,or try again.","error");
        }
      );
  }

  addTutorToDepartment():void{
    //
  }

  deleteTutorInDept(tutorInDept:Tutor):void{
    let departmentId = this.currentDeptId;
    let tutorId = tutorInDept.id;
    swal({
        title: "Are you sure?",
        text: "This will remove "+tutorInDept.firstName+" "+tutorInDept.surName+" from this department",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, remove!",
        cancelButtonText: "No, cancel please!",
        closeOnConfirm: false,
        closeOnCancel: false,
        showLoaderOnConfirm: true
      },
      (isConfirm) => {
        if (isConfirm) {
          /**
           * always use arrow functions otherwise this collides with typescript's this,hence leading to undefined.
           */
          this.departmentService.deleteTutorByDepartmentId(departmentId,tutorId)
            .subscribe(
              (r)=>{
                if(r.status === 0){
                  this.getAllTutorsInDepartment(this.currentDeptId);
                  swal("Success","Successfully Deleted.","success");
                }else{
                  swal("Error",r.message,"error");
                }
              },
              (error)=>{
                swal("Error","Something went wrong.Check your internet,or try again.","error");
              }
            );

        } else {
          swal("Cancelled", "Tutor was not deleted", "error");
        }
      });

  }

  activateDepartmentsOnlyView():void{
    this.isDeptTutorsViewActive = false;
  }

  refreshTutorsInDept():void{

  }

  openAddTutorToDepartmentModal():void{
    this.modalAddTutorToDept.open();
    this.getAllTutorsToAddToDept();
  }

}
