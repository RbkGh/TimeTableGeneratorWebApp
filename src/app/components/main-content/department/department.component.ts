import {Component, OnInit, ViewChild, EventEmitter} from "@angular/core";
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
import {SubjectsArrayCustomResponsePayload} from "../../../models/subjects-array-response-payload";
import {SubjectService} from "../../../services/subject.service";
import {SelectComponent} from "ng2-select";
import {SubjectsArrayDefaultResponsePayload} from "../../../models/subjects-array-default-response-payload";
import {TutorFiltrationService} from "../../../services/tutor-filtration.service";
import {ProgrammeGroupFiltrationService} from "../../../services/programme-group-filtration.service";
import {SubjectFiltrationService} from "../../../services/subject-filtration.service";

declare var swal: any;
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
  providers: [DepartmentService, TutorService,
    SubjectService, ProgrammeGroupService,
    TutorFiltrationService, ProgrammeGroupFiltrationService,
    SubjectFiltrationService]
})
export class DepartmentComponent implements OnInit {

  departments: Array<DepartmentEntity>;
  noOfDepartments: number;
  isDepartmentsListEmpty: boolean = false;
  isTutorsInDeptListEmpty: boolean = false;
  noOfTutorsInDept: number;

  formIsValid: boolean;
  isTutorsListEmpty: boolean = false;
  addDeptForm: FormGroup;
  addTutorToDeptForm: FormGroup;
  updateDeptForm: FormGroup;
  updateTutorInDeptForm: FormGroup;
  /**
   * use this to toggle between tutors in dept view and departments only view in template
   * @type {boolean}
   */
  isDeptTutorsViewActive: boolean = false;

  tutorsInDept: Array<Tutor>;
  tutorsToAddToDept: Array<Tutor>;
  tutorsToChooseHODfrom: Array<Tutor>;
  tutorNames: Array<any>;
  tutorNamesToChooseHODfrom: Array<any>;
  programmeGroupListToChooseProgrammeGroupFrom: Array<any>;
  subjectsToChooseProgrammeSubjectsDocIdListFrom: Array<any>;
  subjectsToAssignToTutor: Array<any>;
  currentProgrammeSubjectsDocIdList: Array<string>;
  tutorNamesInDept: Array<any>;
  tutorNamesToAddToDept: Array<any>;
  tutorIdsToAddToDept: Array<string>;

  @ViewChild('modalAddDept')
  modalAddDept: ModalComponent;
  @ViewChild('modalUpdateDept')
  modalUpdateDept: ModalComponent;
  @ViewChild('modalAddTutorToDept')
  modalAddTutorToDept: ModalComponent;
  @ViewChild('modalUpdateTutorInDept')
  modalUpdateTutorInDept: ModalComponent;
  currentDepartmentToUpdate: DepartmentEntity;
  deptHODtutorId: string;
  currentDeptProgrammeInitials: string;
  currentDeptName: string;
  currentDeptId: string;
  currentDeptHODtutorId: string;

  constructor(public departmentService: DepartmentService,
              public programmeGroupService: ProgrammeGroupService,
              public subjectService: SubjectService,
              public tutorService: TutorService,
              public tutorFiltrationService: TutorFiltrationService,
              public programmeGroupFiltrationService: ProgrammeGroupFiltrationService,
              public subjectFiltrationService: SubjectFiltrationService,
              public formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getAllDepartments();
    this.buildAddDeptForm();
    this.buildUpdateDeptForm();
    this.buildAddTutorToDeptForm();
    this.buildUpdateTutorInDeptForm();
  }

  getAllDepartments(): void {
    this.departmentService.getAllDepartments().subscribe(
      r => {
        if (r.status === 0) {

          if (r.responseObject.length === 0) {
            this.isDepartmentsListEmpty = true;
          } else {
            this.isDepartmentsListEmpty = false;
            this.departments = r.responseObject;
            this.noOfDepartments = r.responseObject.length;
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


  public getAllSubjectsToAddToDepartment(): void {
    this.subjectService.getAllSubjects().subscribe(
      (response: SubjectsArrayDefaultResponsePayload) => {
        console.info(response);
        if (response.status === 0) {

          if (response.responseObject.length > 0) {
            let currentDepartmentsAll: Array<DepartmentEntity> = this.departments || [];
            let finalFilteredSubjects: Array<SubjectEntity> = this.subjectFiltrationService.filterSubjectsThatHaveBeenAssignedADepartment(response.responseObject, currentDepartmentsAll);
            if (finalFilteredSubjects.length === 0) {
              this.modalAddDept.dismiss();
              swal("All Subjects Assigned Already", "All Subjects Have Been Assigned to departments already", "error");
            } else
              this.subjectsToChooseProgrammeSubjectsDocIdListFrom = this.getProgrammeSubjectsDocIdList(finalFilteredSubjects);
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

  /**
   * sort the programmeGroups so that only one programme group is returned coz api
   * returns all classes that have the same programmeInitials but we only need one
   * to refer to the whole programmeGroup and all the number of classes that offer
   * that programme accross board in the whole school.
   */
  getAllProgrammeGroupsAndSortDuplicates(): void {
    this.programmeGroupService.getAllProgrammeGroups()
      .subscribe(
        r => {
          if (r.status === 0) {
            if (r.responseObject.length === 0) {
              swal("No Programmes Created", "You must create at least one programme already in order to create a department", "error");
              this.modalAddDept.dismiss();
            } else {
              let programmeInitialsSet: Set<string> = new Set();
              for (let i: number = 0; i < r.responseObject.length; i++) {
                programmeInitialsSet.add(r.responseObject[i].programmeInitials);
              }
              console.log('ProgrammeInitialsSet:', programmeInitialsSet);

              let programmeInitialsArray: Array<string> = Array.from(programmeInitialsSet.values());//convert to array
              console.log('ProgrammeInitialprogrammeInitialsArray:', programmeInitialsArray);

              let finalProgrammeGroups: Array<ProgrammeGroupEntity> = [];
              for (let i: number = 0; i < programmeInitialsArray.length; i++) {
                let currentProgrammeInitials: string = programmeInitialsArray[i];
                //search for first object with its programmeInitials === currentProgrammeInitials
                for (let iNumber: number = 0; iNumber < r.responseObject.length; iNumber++) {
                  if (r.responseObject[iNumber].programmeInitials === currentProgrammeInitials) {
                    //push the current object with iNumber position,that is current object into the finalProgrammeGroups
                    finalProgrammeGroups.push(r.responseObject[iNumber]);
                    console.log('Pushed');
                    break;
                  }
                }
              }
              if (typeof this.departments !== "undefined" && this.departments.length !== 0) {
                console.log('Final Programme Groups that has been filtered:', finalProgrammeGroups);
                console.log('Departments currently: %s,\n total number of depts =%d', JSON.stringify(this.departments), this.departments.length);
                console.log('DepartmentEntities currently when opening add Dept:=>', this.departments);
                let finalProgrammeGroupsWithRemovedProgrammeGroupsThatHaveDepartments: Array<ProgrammeGroupEntity> =
                  this.programmeGroupFiltrationService.filterProgrammeGroupsAlreadySetToDepartment(this.departments, finalProgrammeGroups);
                if (finalProgrammeGroupsWithRemovedProgrammeGroupsThatHaveDepartments.length !== 0) {
                  this.programmeGroupListToChooseProgrammeGroupFrom = this.getProgrammeGroupInitials(finalProgrammeGroupsWithRemovedProgrammeGroupsThatHaveDepartments);
                } else {
                  swal("All Programmes Have Been Assigned Departments Already", "Solution: Create new Programmes/Classes or delete some existing departments", "error");
                  this.modalAddDept.dismiss();
                }
              } else {
                this.programmeGroupListToChooseProgrammeGroupFrom = this.getProgrammeGroupInitials(finalProgrammeGroups);
              }
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
              let tutorsToChooseHODfrom = this.tutorFiltrationService.filterTutorsAlreadyAssignedToAnyDepartment(response.responseObject);
              if (tutorsToChooseHODfrom.length === 0) {
                this.modalAddDept.dismiss();
                swal("All Tutors Are Currently Assigned To Departments", "Kindly create new Tutors or delete some tutors from the other other departments before you can create a new department", "error");
              } else {
                this.tutorsToChooseHODfrom = tutorsToChooseHODfrom;
                this.tutorNamesToChooseHODfrom = this.getTutorNames(tutorsToChooseHODfrom);
              }
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

  tutorsToChooseHODfromUpdate: Array<Tutor>;
  tutorNamesToChooseHODfromUpdate: Array<any>;

  getAllTutorsToChooseHODforDeptEditModal(deptEntity: DepartmentEntity): void {
    //load only tutors in the department,you can set HOD to only the tutors in the department
    this.departmentService.getAllTutorsByDepartmentId(deptEntity.id)
      .subscribe(
        (response: TutorsArrayResponsePayload) => {
          if (response.status === 0) {
            if (response.responseObject.length === 0) {
              this.modalUpdateDept.dismiss();
              swal("No Tutors Created", "Kindly add the H.O.D to the tutors first.", "error");
            } else {
              this.tutorsToChooseHODfromUpdate = response.responseObject;
              this.tutorNamesToChooseHODfromUpdate = this.getTutorNames(response.responseObject);
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
          console.info('All tutors to add to department response: ', response);
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
    console.info('subjectsToChooseProgrammeSubjectsDocIdListFrom to be populated in dropdown: ', subjectsToChooseProgrammeSubjectsDocIdListFrom);
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
    console.info('Tutor Objects to be populated in dropdown: ', tutorNamesStrings);
    return tutorNamesStrings;
  }

  /**
   *TODO FIX TUTORS TO ADD TO DEPARTMENT NOT LOADING
   *
   */
  addDepartment(addDeptForm: FormGroup): void {
    let deptHODtutorId = this.deptHODtutorId || "";
    let deptProgrammeInitials = this.currentDeptProgrammeInitials || "";
    let programmeSubjectsDocIdList = this.currentProgrammeSubjectsDocIdList || [];

    if (deptHODtutorId === "" || deptProgrammeInitials === "" || programmeSubjectsDocIdList.length === 0) {
      swal("Form is Invalid", "Make sure you have chosen the HOD,the programme and the subject(s) of the Department", "error");
      return;
    }
    console.log('deptHODtutorId :', deptHODtutorId);
    console.log('deptProgrammeInitials :', deptProgrammeInitials);
    console.log('programmeSubjectsDocIdList :', programmeSubjectsDocIdList);
    let departmentEntity: DepartmentEntity = new DepartmentEntity(
      null, addDeptForm.value.deptName, deptHODtutorId, '', deptProgrammeInitials, programmeSubjectsDocIdList);
    console.log('Department Entity to be created ===', departmentEntity);

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
    let deptHODtutorId = this.deptHODtutorIdUpdate;
    let departmentIdToUpdate: string = this.currentDepartmentToUpdate.id;
    let deptProgrammeInitials: string = this.currentDepartmentToUpdate.deptProgrammeInitials;
    let programmeSubjectsDocIdList: Array<string> = this.currentDepartmentToUpdate.programmeSubjectsDocIdList;
    if (typeof deptHODtutorId === "undefined" || deptHODtutorId === "" || deptHODtutorId === null) {
      swal("H.O.D not chosen", "Choose an H.O.D to update the department", "error");
      return;
    }
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
        console.log('Update response =', r);
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
              (r) => {
                if (r.status === 0) {
                  this.ngOnInit();
                  swal("Successful", "Department deleted successfully", "success");
                } else {
                  swal("Error", r.message, "error");
                }
              },
              error => {
                swal("Error", "Something went wrong.Try again", "error");
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
              (r) => {
                if (r.status === 0) {
                  this.ngOnInit();
                  swal("Successful", "All Departments deleted successfully", "success");
                } else {
                  swal("Error", r.message, "error");
                }
              },
              error => {
                swal("Error", "Something went wrong.Try again", "error");
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

  deptHODtutorIdUpdate: string;

  public selectedHODUpdate(value: any): void {
    console.log('Selected value is: ', value);
    console.log('value id=', value.id);
    this.deptHODtutorIdUpdate = value.id;
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
    let tutorIdsToAddToDept: Array<string> = [];

    for (let i: number = 0; i < value.length; i++) {
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

  buildUpdateTutorInDeptForm(): void {
    this.updateTutorInDeptForm = this.formBuilder.group({});
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
    this.getAllSubjectsToAddToDepartment();
    this.getAllProgrammeGroupsAndSortDuplicates();
    this.getAllTutorsToChooseHODforDept();
  }

  onModalAddDepartmentOpen(): EventEmitter<any> {

    return new EventEmitter();
  }

  openEditDepartmentModal(deptEntity: DepartmentEntity): void {
    this.currentDepartmentToUpdate = deptEntity;
    this.modalUpdateDept.open();
    this.buildUpdateDeptForm(deptEntity);
    this.getAllTutorsToChooseHODforDeptEditModal(deptEntity);
  }

  refreshPage(): void {
    this.ngOnInit();
  }

  currentProgrammeSubjectsDocIdListForAssigningTutor: Array<string>;

  activateTutorsInDeptView(departmentEntity: DepartmentEntity): void {
    console.info("DepartmentEntity To Retrieve Tutors : ", departmentEntity);
    this.currentDeptName = departmentEntity.deptName;
    this.currentDeptId = departmentEntity.id;
    this.currentDeptHODtutorId = departmentEntity.deptHODtutorId;
    this.isDeptTutorsViewActive = true;
    this.currentProgrammeSubjectsDocIdListForAssigningTutor = departmentEntity.programmeSubjectsDocIdList;
    this.getAllTutorsInDepartment(departmentEntity.id);
    this.getAllSubjectsInDept();
  }

  getAllTutorsInDepartment(departmentId: string): void {
    this.departmentService.getAllTutorsByDepartmentId(departmentId)
      .subscribe(
        (r) => {
          if (r.status === 0) {
            if (r.responseObject.length === 0) {
              this.isTutorsInDeptListEmpty = true;
            } else {
              this.tutorsInDept = r.responseObject;
              this.noOfTutorsInDept = r.responseObject.length;
              this.tutorNamesInDept = this.getTutorNames(r.responseObject);
            }
          } else {
            swal("Error", r.message, "error");
            this.isDeptTutorsViewActive = false;
          }
        },
        (error) => {
          swal("Error", "Something went wrong.Check your internet,or try again.", "error");
        }
      );
  }

  deleteTutorInDept(tutorInDept: Tutor): void {
    let departmentId = this.currentDeptId;
    let tutorId = tutorInDept.id;
    swal({
        title: "Are you sure?",
        text: "This will remove " + tutorInDept.firstName + " " + tutorInDept.surName + " from this department",
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
          this.departmentService.deleteTutorByDepartmentId(departmentId, tutorId)
            .subscribe(
              (r) => {
                if (r.status === 0) {
                  this.getAllTutorsInDepartment(this.currentDeptId);
                  swal("Success", "Successfully Deleted.", "success");
                } else {
                  swal("Error", r.message, "error");
                }
              },
              (error) => {
                swal("Error", "Something went wrong.Check your internet,or try again.", "error");
              }
            );

        } else {
          swal("Cancelled", "Tutor was not deleted", "error");
        }
      });

  }

  activateDepartmentsOnlyView(): void {
    this.isDeptTutorsViewActive = false;
  }

  refreshTutorsInDept(): void {
    this.getAllTutorsInDepartment(this.currentDeptId);
  }

  openAddTutorToDepartmentModal(): void {
    this.modalAddTutorToDept.open();
    this.getAllTutorsToAddToDept();
  }

  addTutorsToDepartment(): void {
    let tutorIdsList = this.tutorIdsToAddToDept;
    let currentDeptId = this.currentDeptId;
    console.info('tutorIds List = ', tutorIdsList);
    console.info('current DeptId = ', currentDeptId);
    if (tutorIdsList.length === 0) {
      swal("Error", "Please choose at least one tutor to add to department", "error");
    } else {
      this.departmentService.addTutorsToDepartment(currentDeptId, tutorIdsList)
        .subscribe(
          r => {
            if (r.status === 0) {
              this.modalAddTutorToDept.dismiss();
              swal("Success", "Tutor(s) added to department successfully", "success");
              this.getAllTutorsInDepartment(currentDeptId);
            } else {
              swal("Error", r.message, "error");
            }
          },
          error => {
            swal("Error", "Please Try Again", "error");
          }
        );
    }
  }

  subjectsInDeptFiltered: Array<SubjectEntity>;

  public getAllSubjectsInDept(): void {
    this.subjectService.getAllSubjects().subscribe(
      (response: SubjectsArrayDefaultResponsePayload) => {
        console.info('GetAllSubjectsResponse: ', response);
        if (response.status === 0) {

          if (response.responseObject.length > 0) {
            let subjectsToAssignToTutor: Array<SubjectEntity> = response.responseObject;//this.getProgrammeSubjectsDocIdList(response.responseObject);
            let finalSubjectsToAssignToTutor: Array<SubjectEntity> = [];
            for (let i: number = 0; i < subjectsToAssignToTutor.length; i++) {
              let currentIndex: number = this.currentProgrammeSubjectsDocIdListForAssigningTutor.indexOf(subjectsToAssignToTutor[i].id);
              console.log('current index =', currentIndex);
              if (currentIndex === -1) {
                //not found,hence do not add to final list
              } else {
                //found,add to final list
                finalSubjectsToAssignToTutor.push(subjectsToAssignToTutor[i]);
              }
            }
            console.log('SubjectsToAssignToTutor Filtered=>', finalSubjectsToAssignToTutor);
            this.subjectsInDeptFiltered = finalSubjectsToAssignToTutor;
          } else {

          }
        } else {

        }
      },
      (error: any) => {
        this.modalUpdateTutorInDept.dismiss();
        swal("Error", "Ensure you have a working internet connection", "error");
        console.log(error);
      }
    );
  }

  openUpdateTutorInDeptModal(tutorInDept: Tutor) {
    this.modalUpdateTutorInDept.open();
    this.getAllSubjectsToAssignToTutorFilteringSubjectsNotInDept();
    this.getAllProgrammeGroupsWithoutFilteringDuplicates();
  }

  /**
   * START OF NG-SELECT METHODS FOR UPDATING TUTORS IN DEPARTMENT
   *
   */

  public getAllSubjectsToAssignToTutorFilteringSubjectsNotInDept(): void {
    this.subjectService.getAllSubjects().subscribe(
      (response: SubjectsArrayDefaultResponsePayload) => {
        console.info('GetAllSubjectsResponse: ', response);
        if (response.status === 0) {

          if (response.responseObject.length > 0) {
            let subjectsToAssignToTutor: Array<SubjectEntity> = response.responseObject;//this.getProgrammeSubjectsDocIdList(response.responseObject);
            let finalSubjectsToAssignToTutor: Array<SubjectEntity> = [];
            for (let i: number = 0; i < subjectsToAssignToTutor.length; i++) {
              let currentIndex: number = this.currentProgrammeSubjectsDocIdListForAssigningTutor.indexOf(subjectsToAssignToTutor[i].id);
              console.log('current index =', currentIndex);
              if (currentIndex === -1) {
                //not found,hence do not add to final list
              } else {
                //found,add to final list
                finalSubjectsToAssignToTutor.push(subjectsToAssignToTutor[i]);
              }
            }
            console.log('SubjectsToAssignToTutor Filtered=>', finalSubjectsToAssignToTutor);
            this.subjectsToAssignToTutor = this.getProgrammeSubjectsDocIdList(finalSubjectsToAssignToTutor);
          } else {
            this.modalUpdateTutorInDept.dismiss();
            swal("No Subjects Created", "At least one subject must be created before a subject can be assigned to tutor", "error");
          }
        } else {
          this.modalUpdateTutorInDept.dismiss();
          swal("Error", "Something went wrong,try again.", "error");
        }
      },
      (error: any) => {
        this.modalUpdateTutorInDept.dismiss();
        swal("Error", "Ensure you have a working internet connection", "error");
        console.log(error);
      }
    );
  }

  programmeGroupListToChooseTutorClassesFrom1: Array<any>;

  getAllProgrammeGroupsWithoutFilteringDuplicates(): void {
    this.programmeGroupService.getAllProgrammeGroups()
      .subscribe(
        r => {
          if (r.status === 0) {
            if (r.responseObject.length === 0) {
              swal("No Programmes Created", "You must create at least one programme already in order to create assign subjects and classes to tutor", "error");
              this.modalUpdateTutorInDept.dismiss();
            } else {

              this.programmeGroupListToChooseTutorClassesFrom1 = this.getProgrammeGroupProgrammeCodes(r.responseObject);
            }
          } else {
            this.modalUpdateTutorInDept.dismiss();
            swal("Error", r.message || "Please Try Again Later", "error");
          }
        },
        error => {
          this.modalUpdateTutorInDept.dismiss();
          swal("Something went wrong", "Please Try Again", "error");
        }
      );
  }


  getProgrammeGroupProgrammeCodes(programmeGroups: Array<ProgrammeGroupEntity>): Array<any> {
    let programmeGroupInitials: Array<any> = [];
    for (let i: number = 0; i < programmeGroups.length; i++) {
      programmeGroupInitials[i] = {
        id: programmeGroups[i].programmeCode,
        text: programmeGroups[i].programmeCode
      };
    }
    console.info('ProgrammeGroup Objects to be populated in dropdown: ', programmeGroupInitials);
    return programmeGroupInitials;
  }

  refreshSingleSubjectData1(value: any): void {
    //this.value = value;
    console.log('Data =', value);
  }

  selectedSubject1: string;
  @ViewChild('programmeGroupsSelectHandle')
  private programmeGroupsSelectHandle: SelectComponent;

  subjectSelected1(value: any): void {
    console.log('Selected value is: ', value);
    console.log('Selected Subject id=', value.id);
    let currentProgGroupSelectItem: Array<any> = this.currentProgGroupSelectItem || [];
    let lengthOfCurrentProgrammeGroupSelectItems: number = currentProgGroupSelectItem.length;
    if ((lengthOfCurrentProgrammeGroupSelectItems !== 0) && (typeof lengthOfCurrentProgrammeGroupSelectItems !== "undefined")) {
      for (let i: number = 0; i < lengthOfCurrentProgrammeGroupSelectItems; i++) {
        this.programmeGroupsSelectHandle.remove(currentProgGroupSelectItem[i]);//remove all SelectItem objects from programmeGroupList
      }
    }

    this.selectedSubject1 = value.id;
  }

  public typedChar1(value: any): void {
    console.log('New search input: ', value);
  }

  progGroupIdsToAddToTutor1: Array<string>;
  currentProgGroupSelectItem: Array<any>;

  public refreshMultipleProgGroupData1(value: any): void {
    let progGroupIdsToAddToTutor: Array<string> = [];

    for (let i: number = 0; i < value.length; i++) {
      progGroupIdsToAddToTutor.push(value[i].id);
    }
    this.progGroupIdsToAddToTutor1 = progGroupIdsToAddToTutor;//equate to the progGroupIdsToAddToTutor1 array
    this.currentProgGroupSelectItem = value; //this will be used to calculate no of selected programmeGroups.
    console.log('Data =', value);
    console.log('ProgrammeGroupIdsArray =', this.progGroupIdsToAddToTutor1);
  }

  public typedProgrammeGroupChar1(value: any): void {
    console.log('Programme Group Char search input: ', value);
  }

  public removedProgrammeGroup1(value: any): void {
    console.log('removed Programme Group1 is..', value);
  }


  /**
   * END OF NG-SELECT METHODS FOR UPDATING TUTORS IN DEPARTMENT
   *
   */
}
