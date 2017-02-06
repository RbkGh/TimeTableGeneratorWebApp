import {Component, OnInit, ViewChild} from "@angular/core";
import {DepartmentService} from "../../../services/department.service";
import {TutorService} from "../../../services/tutor.service";
import {DepartmentEntity} from "../../../models/department-entity";
import {ModalComponent} from "ng2-bs3-modal/components/modal";
import {FormGroup, FormBuilder, FormControl, Validators} from "@angular/forms";
import {Tutor} from "../../../models/TutorResponsePayload";
import {TutorsArrayResponsePayload} from "../../../models/tutors-array-response-payload";
import {DepartmentResponsePayload} from "../../../models/department-response-payload";
import {ProgrammeGroupService} from "../../../services/programme-group.service";
import {ProgrammeGroupEntity} from "../../../models/programme-group-entity";
import {SubjectEntity} from "../../../models/subject-entity";
import {SubjectsArrayResponsePayload} from "../../../models/subjects-array-response-payload";
import {SubjectService} from "../../../services/subject.service";

declare var swal: any;
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
  providers: [DepartmentService, TutorService, SubjectService, ProgrammeGroupService]
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
  tutorsToAddToDept:Array<Tutor>;
  tutorsToChooseHODfrom:Array<Tutor>;
  tutorNames: Array<any>;
  tutorNamesToChooseHODfrom: Array<any>;
  programmeGroupListToChooseProgrammeGroupFrom: Array<any>;
  subjectsToChooseProgrammeSubjectsDocIdListFrom: Array<any>;
  currentProgrammeSubjectsDocIdList: Array<string>;
  tutorNamesInDept:Array<any>;
  tutorNamesToAddToDept:Array<any>;
  tutorIdsToAddToDept:Array<string>;

  @ViewChild('modalAddDept')
  modalAddDept: ModalComponent;
  @ViewChild('modalUpdateDept')
  modalUpdateDept: ModalComponent;
  @ViewChild('modalAddTutorToDept')
  modalAddTutorToDept: ModalComponent;
  currentDepartmentToUpdate:DepartmentEntity;
  deptHODtutorId: string;
  currentDeptProgrammeInitials: string;
  currentDeptName: string;
  currentDeptId:string;
  currentDeptHODtutorId:string;

  constructor(public departmentService: DepartmentService,
              public programmeGroupService: ProgrammeGroupService,
              public subjectService: SubjectService,
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

  public getAllSubjects(): void {
    this.subjectService.getAllSubjects().subscribe(
      (response: SubjectsArrayResponsePayload) => {
        console.info(response);
        if (response.status === 0) {

          if (response.responseObject.length > 0) {
            this.subjectsToChooseProgrammeSubjectsDocIdListFrom = this.getProgrammeSubjectsDocIdList(response.responseObject);
          } else {
            this.modalAddDept.dismiss();
            swal("No Subjects Created", "At least one subject must be created before a department can be created", "error");
          }
        } else {
          this.modalAddDept.dismiss();
          swal("Error", "Something went wrong,try again.", "error");
        }
      },
      (error: any) => {
        swal("Error", "Ensure you have a working internet connection", "error");
        console.log(error);
      }
    );
  }

  getAllProgrammeGroups(): void {
    this.programmeGroupService.getAllProgrammeGroups()
      .subscribe(
        r => {
          if (r.status === 0) {
            if (r.responseObject.length === 0) {
              swal("No Programmes Created", "You must create at least one programme already in order to create a department", "error");
              this.modalAddDept.dismiss();
            } else {
              this.programmeGroupListToChooseProgrammeGroupFrom = this.getProgrammeGroupInitials(r.responseObject);
            }
          } else {
            this.modalAddDept.dismiss();
            swal("Error", r.message || "Please Try Again Later", "error");
          }
        },
        error => {
          this.modalAddDept.dismiss();
          swal("Something went wrong", "Please Try Again", "error");
        }
      );
  }

  getAllTutorsToChooseHODforDept(): void {
    this.tutorService.getAllTutors()
      .subscribe(
        (response: TutorsArrayResponsePayload) => {
          if (response.status === 0) {
            if (response.responseObject.length === 0) {
              this.modalAddDept.dismiss();
              this.isTutorsListEmpty = true;
              swal("No Tutors Created", "Kindly add the H.O.D to the tutors first.", "error");
            } else {
              this.tutorsToChooseHODfrom = response.responseObject;
              this.tutorNamesToChooseHODfrom = this.getTutorNames(response.responseObject);
              console.log('tutorNames objects =',this.tutorNames);
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

  getAllTutorsToAddToDept(): void {
    this.tutorService.getAllTutors()
      .subscribe(
        (response: TutorsArrayResponsePayload) => {
          console.info('All tutors to add to department response: ',response);
          if (response.status === 0) {
            if (response.responseObject.length === 0) {
              this.modalAddTutorToDept.dismiss();
              swal("No Tutors Created", "Kindly create tutors to add to department", "error");
            } else {
              console.log("Tutors to add to department====", response.responseObject);
              this.tutorsToAddToDept = response.responseObject;
              this.tutorNamesToAddToDept = this.getTutorNames(response.responseObject);
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
   * @param programmeGroups
   * @returns {Array<any>}
   */
  getProgrammeGroupInitials(programmeGroups: Array<ProgrammeGroupEntity>): Array<any> {
    let programmeGroupInitials: Array<any> = [];
    for (let i: number = 0; i < programmeGroups.length; i++) {
      programmeGroupInitials[i] = {
        id: programmeGroups[i].id,
        text: programmeGroups[i].programmeInitials
      };
    }
    console.info('ProgrammeGroup Objects to be populated in dropdown: ', programmeGroupInitials);
    return programmeGroupInitials;
  }

  getProgrammeSubjectsDocIdList(subjectEntities: Array<SubjectEntity>): Array<any> {
    let subjectsToChooseProgrammeSubjectsDocIdListFrom: Array<any> = [];
    for (let i: number = 0; i < subjectEntities.length; i++) {
      subjectsToChooseProgrammeSubjectsDocIdListFrom[i] = {
        id: subjectEntities[i].id,
        text: subjectEntities[i].subjectFullName
      };
    }
    console.info('ProgrammeGroup Objects to be populated in dropdown: ', subjectsToChooseProgrammeSubjectsDocIdListFrom);
    return subjectsToChooseProgrammeSubjectsDocIdListFrom;
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
    console.info('Tutor Objects to be populated in dropdown: ',tutorNamesStrings);
    return tutorNamesStrings;
  }

  /**
   *TODO FIX TUTORS TO ADD TO DEPARTMENT NOT LOADING
   *
   */
  addDepartment(addDeptForm: FormGroup): void {
    let deptHODtutorId = this.deptHODtutorId;
    let deptProgrammeInitials = this.currentDeptProgrammeInitials;
    let programmeSubjectsDocIdList = this.currentProgrammeSubjectsDocIdList;

    console.log('deptHODtutorId :', deptHODtutorId);
    console.log('deptProgrammeInitials :', deptProgrammeInitials);
    console.log('programmeSubjectsDocIdList :', programmeSubjectsDocIdList);
    let departmentEntity: DepartmentEntity = new DepartmentEntity(
      null, addDeptForm.value.deptName, deptHODtutorId, '', deptProgrammeInitials, programmeSubjectsDocIdList);
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
    let deptProgrammeInitials: string = this.currentDepartmentToUpdate.deptProgrammeInitials;
    let programmeSubjectsDocIdList: Array<string> = this.currentDepartmentToUpdate.programmeSubjectsDocIdList;
    console.log('deptHODtutorId :', deptHODtutorId);
    console.log('departmentIdToUpdate :', departmentIdToUpdate);
    console.log('DepartmentNameUpdate  :', updateDeptForm.value.deptNameUpdate);
    let departmentEntity: DepartmentEntity = new DepartmentEntity(departmentIdToUpdate,
      updateDeptForm.value.deptNameUpdate,
      deptHODtutorId,
      '',
      deptProgrammeInitials,
      programmeSubjectsDocIdList);

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

  public selectedDeptProgrammeGroupInitialsController(value: any): void {
    console.log('Selected value is: ', value);
    console.log('value id=', value.id);
    console.log('value text=', value.text);
    this.currentDeptProgrammeInitials = value.text;
  }

  public refreshValue(value: any): void {
    //this.value = value;
    console.log('Data =', value);
  }

  public refreshValueDeptProgrammeGroupInitialsController(value: any): void {
    //this.value = value;
    console.log('Data =', value);
  }

  public refreshValueMultipleSubjectsToAddToDepartment(value: any): void {
    let programmeSubjectCodeIds: Array<string> = [];

    for (let i: number = 0; i < value.length; i++) {
      programmeSubjectCodeIds.push(value[i].id);
    }
    this.currentProgrammeSubjectsDocIdList = programmeSubjectCodeIds;//equate to the currentProgrammeSubjectsDocIdList array
    console.log('Data =', value);
    console.log('currentProgrammeSubjectsDocIdList =', this.currentProgrammeSubjectsDocIdList);

  }
  public refreshValueMultiple(value: any): void {
    let tutorIdsToAddToDept:Array<string> =[];

    for(let i:number=0;i<value.length;i++) {
      tutorIdsToAddToDept.push(value[i].id);
    }
    this.tutorIdsToAddToDept = tutorIdsToAddToDept;//equate to the tutorIdsToAddToDept array
    console.log('Data =', value);
    console.log('TutorIds =', this.tutorIdsToAddToDept);

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
    this.getAllSubjects();
    this.getAllProgrammeGroups();
    this.getAllTutorsToChooseHODforDept();
  }

  openEditDepartmentModal(deptEntity: DepartmentEntity): void {
    this.currentDepartmentToUpdate = deptEntity;
    this.modalUpdateDept.open();
    this.buildUpdateDeptForm(deptEntity);
    this.getAllTutorsToChooseHODforDept();
  }

  refreshPage(): void {
    this.ngOnInit();
  }

  activateTutorsInDeptView(departmentEntity:DepartmentEntity):void{
    console.info("DepartmentEntity To Retrieve Tutors : ",departmentEntity);
    this.currentDeptName = departmentEntity.deptName;
    this.currentDeptId = departmentEntity.id;
    this.currentDeptHODtutorId = departmentEntity.deptHODtutorId;
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
    this.getAllTutorsInDepartment(this.currentDeptId);
  }

  openAddTutorToDepartmentModal():void{
    this.modalAddTutorToDept.open();
    this.getAllTutorsToAddToDept();
  }

  addTutorsToDepartment():void{
    let tutorIdsList = this.tutorIdsToAddToDept;
    let currentDeptId = this.currentDeptId;
    console.info('tutorIds List = ',tutorIdsList);
    console.info('current DeptId = ',currentDeptId);
    if(tutorIdsList.length === 0) {
      swal("Error","Please choose at least one tutor to add to department","error");
    }else{
      this.departmentService.addTutorsToDepartment(currentDeptId,tutorIdsList)
        .subscribe(
          r=>{
            if(r.status === 0) {
              this.modalAddTutorToDept.dismiss();
              swal("Success","Tutor(s) added to department successfully","success");
              this.getAllTutorsInDepartment(currentDeptId);
            }else{
              swal("Error",r.message,"error");
            }
          },
          error=>{
            swal("Error","Please Try Again","error");
          }
        );
    }
  }

}
