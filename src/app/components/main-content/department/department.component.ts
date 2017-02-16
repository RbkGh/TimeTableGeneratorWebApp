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
import {SubjectService} from "../../../services/subject.service";
import {SelectComponent} from "ng2-select";
import {SubjectsArrayDefaultResponsePayload} from "../../../models/subjects-array-default-response-payload";
import {TutorFiltrationService} from "../../../services/tutor-filtration.service";
import {ProgrammeGroupFiltrationService} from "../../../services/programme-group-filtration.service";
import {SubjectFiltrationService} from "../../../services/subject-filtration.service";
import {TutorSubjectIdAndProgrammeCodesListObj} from "../../../models/tutor-subject-id-and-programme-codes-list-obj";

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
  subjectsToAssignToTutor1: Array<any>;
  subjectsToAssignToTutor2: Array<any>;
  subjectsToAssignToTutor3: Array<any>;
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
    this.subjectsToChooseProgrammeSubjectsDocIdListFrom = [];//THIS WILL ENSURE THAT THE LAST CACHED VALUE IS NOT USED,IF NOT SET LAST CACHED VALUE WILL BE USED AND THIS WILL CAUSE A VERY BIG ISSUE IN BACKEND!!!
    this.currentProgrammeSubjectsDocIdList = [];//reset  as the last item may have the last cached value still available and this will cause a serious error in backend if user submits
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
            } else {
              this.subjectsToChooseProgrammeSubjectsDocIdListFrom = this.getProgrammeSubjectsDocIdList(finalFilteredSubjects);
            }
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
    this.programmeGroupListToChooseProgrammeGroupFrom = []//THIS WILL ENSURE THAT THE LAST CACHED VALUE IS NOT USED,IF NOT SET LAST CACHED VALUE WILL BE USED AND THIS WILL CAUSE A VERY BIG ISSUE IN BACKEND!!!
    this.currentDeptProgrammeInitials = "";//reset  as the last item may have the last cached value still available and this will cause a serious error in backend if user submits
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
                if (finalProgrammeGroupsWithRemovedProgrammeGroupsThatHaveDepartments.length > 0) {
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
    this.tutorNamesToChooseHODfrom = [];//THIS WILL ENSURE THAT THE LAST CACHED VALUE IS NOT USED,IF NOT SET LAST CACHED VALUE WILL BE USED AND THIS WILL CAUSE A VERY BIG ISSUE IN BACKEND!!!
    this.deptHODtutorId = "";//reset the hodTutorId as the last item may have the last cached value still available
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

  getAllTutorsNotAssignedToAnyDeptsToAddToCurrentDepartment(): void {
    this.tutorNamesToAddToDept = [];//THIS WILL ENSURE THAT THE LAST CACHED VALUE IS NOT USED,IF NOT SET LAST CACHED VALUE WILL BE USED AND THIS WILL CAUSE A VERY BIG ISSUE IN BACKEND!!!
    this.tutorIdsToAddToDept = [];//reset the tutorIdsToAddToDept as the last item may have the last cached value still available
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
              let tutorsToAddToDept: Array<Tutor> = this.tutorFiltrationService.filterTutorsAlreadyAssignedToAnyDepartment(response.responseObject);
              if (tutorsToAddToDept.length > 0) {
                this.tutorsToAddToDept = tutorsToAddToDept;
                this.tutorNamesToAddToDept = this.getTutorNames(tutorsToAddToDept);
              } else {
                this.modalAddTutorToDept.dismiss();
                swal("All Tutors Have Been Assigned Departments Already", "To Add New Tutors to this department\n,Create New Tutors or Delete some tutors in other departments", "error");
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

  @ViewChild('ngSelectSubjectsToAddToDept')
  ngSelectSubjectsToAddToDept: SelectComponent;
  @ViewChild('ngSelectProgrammeForDept')
  ngSelectProgrammeForDept: SelectComponent;
  @ViewChild('ngSelectTutorsToChooseHODfrom')
  ngSelectTutorsToChooseHODfrom: SelectComponent;

  openAddDepartmentModal(): void {
    this.resetNgSelectValues(this.ngSelectSubjectsToAddToDept);
    this.resetNgSelectValues(this.ngSelectProgrammeForDept);
    this.resetNgSelectValues(this.ngSelectTutorsToChooseHODfrom);
    this.modalAddDept.open();
    this.getAllTutorsToChooseHODforDept();
    this.getAllProgrammeGroupsAndSortDuplicates();
    this.getAllSubjectsToAddToDepartment();
  }

  resetNgSelectValues(selectComponent: SelectComponent): void {
    let activeItems: Array<any> = selectComponent.active || [];
    let activeItemsLength: number = activeItems.length;
    if ((typeof activeItems !== "undefined") && (activeItemsLength !== 0)) {
      for (let i: number = 0; i < activeItemsLength; i++) {
        selectComponent.remove(activeItems[i]);
      }
    }
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

  @ViewChild('ngSelectTutorsToAddToDepartment')
  ngSelectTutorsToAddToDepartment: SelectComponent;

  openAddTutorToDepartmentModal(): void {
    this.resetNgSelectValues(this.ngSelectTutorsToAddToDepartment);//reset the ng values on form when opening modal
    this.modalAddTutorToDept.open();
    this.getAllTutorsNotAssignedToAnyDeptsToAddToCurrentDepartment();
  }

  addTutorsToDepartment(): void {
    let tutorIdsList = this.tutorIdsToAddToDept || [];
    let currentDeptId = this.currentDeptId || "";
    console.info('tutorIds List = ', tutorIdsList);
    console.info('current DeptId = ', currentDeptId);
    if (tutorIdsList.length === 0 || currentDeptId === "") {
      swal("Error", "Please choose at least one tutor to add to department", "error");
      return;
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

  resetAllNgSelectValuesArray(selectComponents: Array<SelectComponent>): void {
    if (selectComponents.length > 0) {
      for (let i: number = 0; i < selectComponents.length; i++) {
        this.resetNgSelectValues(selectComponents[i]);
      }
    }
  }

  @ViewChild('ngSelectSubjectsToAssignToTutor1')
  ngSelectSubjectsToAssignToTutor1: SelectComponent;
  @ViewChild('ngSelectProgrammeGroupsOrClassesAssignedToTutors1')
  ngSelectProgrammeGroupsOrClassesAssignedToTutors1: SelectComponent;
  @ViewChild('ngSelectSubjectsToAssignToTutor2')
  ngSelectSubjectsToAssignToTutor2: SelectComponent;
  @ViewChild('ngSelectProgrammeGroupsOrClassesAssignedToTutors2')
  ngSelectProgrammeGroupsOrClassesAssignedToTutors2: SelectComponent;
  @ViewChild('ngSelectSubjectsToAssignToTutor3')
  ngSelectSubjectsToAssignToTutor3: SelectComponent;
  @ViewChild('ngSelectProgrammeGroupsOrClassesAssignedToTutors3')
  ngSelectProgrammeGroupsOrClassesAssignedToTutors3: SelectComponent;

  currentTutorInDeptBeforeOpeningUpdateTutorModal: Tutor;

  openUpdateTutorInDeptModal(tutorInDept: Tutor) {
    this.currentTutorInDeptBeforeOpeningUpdateTutorModal = tutorInDept;
    this.resetAllNgSelectValuesArray([
      this.ngSelectSubjectsToAssignToTutor1,
      this.ngSelectProgrammeGroupsOrClassesAssignedToTutors1,
      this.ngSelectSubjectsToAssignToTutor2,
      this.ngSelectProgrammeGroupsOrClassesAssignedToTutors2,
      this.ngSelectSubjectsToAssignToTutor3,
      this.ngSelectProgrammeGroupsOrClassesAssignedToTutors3]); //reset all ngSelect form values
    this.modalUpdateTutorInDept.open();
    this.getAllSubjectsToAssignToTutorFilteringSubjectsNotInDept();
    this.getAllProgrammeGroupsWithoutFilteringDuplicates();
  }

  /**
   * START OF NG-SELECT METHODS FOR UPDATING TUTORS IN DEPARTMENT
   *
   */

  noOfSubjectsAvailableToBeAssigned: number;

  public getAllSubjectsToAssignToTutorFilteringSubjectsNotInDept(): void {
    this.noOfSubjectsAvailableToBeAssigned = 0;
    this.selectedSubject1 = "";
    this.subjectsToAssignToTutor1 = [];
    this.selectedSubject2 = "";
    this.subjectsToAssignToTutor2 = [];
    this.selectedSubject3 = "";
    this.subjectsToAssignToTutor3 = [];

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
            if (finalSubjectsToAssignToTutor.length > 0) {
              this.noOfSubjectsAvailableToBeAssigned = finalSubjectsToAssignToTutor.length;
              console.log('No of subjects available to be assigned => ', this.noOfSubjectsAvailableToBeAssigned);
              let finalFullyCheckedNgSelectObjects = this.getProgrammeSubjectsDocIdList(finalSubjectsToAssignToTutor);
              this.subjectsToAssignToTutor1 = finalFullyCheckedNgSelectObjects;
              this.subjectsToAssignToTutor2 = finalFullyCheckedNgSelectObjects;
              this.subjectsToAssignToTutor3 = finalFullyCheckedNgSelectObjects;
            } else {
              swal("Error", "Something went terribly wrong.Please retry again later.", "error");
              this.modalUpdateTutorInDept.dismiss();
            }
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
  programmeGroupListToChooseTutorClassesFrom2: Array<any>;
  programmeGroupListToChooseTutorClassesFrom3: Array<any>;

  getAllProgrammeGroupsWithoutFilteringDuplicates(): void {
    this.progGroupIdsToAddToTutor1 = [];
    this.programmeGroupListToChooseTutorClassesFrom1 = [];
    this.progGroupIdsToAddToTutor2 = [];
    this.programmeGroupListToChooseTutorClassesFrom2 = [];
    this.progGroupIdsToAddToTutor3 = [];
    this.programmeGroupListToChooseTutorClassesFrom3 = [];
    this.programmeGroupService.getAllProgrammeGroups()
      .subscribe(
        r => {
          if (r.status === 0) {
            if (r.responseObject.length === 0) {
              swal("No Programmes Created", "You must create at least one programme already in order to create assign subjects and classes to tutor", "error");
              this.modalUpdateTutorInDept.dismiss();
            } else {
              let programmeGroupListToChooseTutorClassesFrom = this.getProgrammeGroupProgrammeCodes(r.responseObject);
              this.programmeGroupListToChooseTutorClassesFrom1 = programmeGroupListToChooseTutorClassesFrom;
              this.programmeGroupListToChooseTutorClassesFrom2 = programmeGroupListToChooseTutorClassesFrom;
              this.programmeGroupListToChooseTutorClassesFrom3 = programmeGroupListToChooseTutorClassesFrom;
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
    console.log('Data1 =', value);
  }

  refreshSingleSubjectData2(value: any): void {
    //this.value = value;
    console.log('Data2 =', value);
  }

  refreshSingleSubjectData3(value: any): void {
    //this.value = value;
    console.log('Data3 =', value);
  }

  selectedSubject1: string;
  currentProgGroupSelectItem1: Array<any>;

  subjectSelected1(value: any): void {
    console.log('Selected value1 is: ', value);
    console.log('Selected Subject1 id=', value.id);
    //reset classes selected
    let currentProgGroupSelectItem: Array<any> = this.currentProgGroupSelectItem1 || [];
    let lengthOfCurrentProgrammeGroupSelectItems: number = currentProgGroupSelectItem.length;
    if ((lengthOfCurrentProgrammeGroupSelectItems !== 0) && (typeof lengthOfCurrentProgrammeGroupSelectItems !== "undefined")) {
      for (let i: number = 0; i < lengthOfCurrentProgrammeGroupSelectItems; i++) {
        this.ngSelectProgrammeGroupsOrClassesAssignedToTutors1.remove(currentProgGroupSelectItem[i]);//remove all SelectItem objects from programmeGroupList
      }
    }
    //reset classes selected
    this.selectedSubject1 = value.id;
  }

  currentProgGroupSelectItem2: Array<any>;
  selectedSubject2: string;

  subjectSelected2(value: any): void {
    console.log('Selected value2 is: ', value);
    console.log('Selected Subject2 id=', value.id);
    //reset classes selected
    let currentProgGroupSelectItem: Array<any> = this.currentProgGroupSelectItem2 || [];
    let lengthOfCurrentProgrammeGroupSelectItems: number = currentProgGroupSelectItem.length;
    if ((lengthOfCurrentProgrammeGroupSelectItems !== 0) && (typeof lengthOfCurrentProgrammeGroupSelectItems !== "undefined")) {
      for (let i: number = 0; i < lengthOfCurrentProgrammeGroupSelectItems; i++) {
        this.ngSelectProgrammeGroupsOrClassesAssignedToTutors2.remove(currentProgGroupSelectItem[i]);//remove all SelectItem objects from programmeGroupList
      }
    }
    //reset classes selected
    this.selectedSubject2 = value.id;
  }

  currentProgGroupSelectItem3: Array<any>;
  selectedSubject3: string;

  subjectSelected3(value: any): void {
    console.log('Selected value3 is: ', value);
    console.log('Selected Subject3 id=', value.id);
    //reset classes selected
    let currentProgGroupSelectItem: Array<any> = this.currentProgGroupSelectItem3 || [];
    let lengthOfCurrentProgrammeGroupSelectItems: number = currentProgGroupSelectItem.length;
    if ((lengthOfCurrentProgrammeGroupSelectItems !== 0) && (typeof lengthOfCurrentProgrammeGroupSelectItems !== "undefined")) {
      for (let i: number = 0; i < lengthOfCurrentProgrammeGroupSelectItems; i++) {
        this.ngSelectProgrammeGroupsOrClassesAssignedToTutors3.remove(currentProgGroupSelectItem[i]);//remove all SelectItem objects from programmeGroupList
      }
    }
    //reset classes selected
    this.selectedSubject3 = value.id;
  }

  public typedChar1(value: any): void {
    console.log('New search input1: ', value);
  }

  public typedChar2(value: any): void {
    console.log('New search input2: ', value);
  }

  public typedChar3(value: any): void {
    console.log('New search input: ', value);
  }

  progGroupIdsToAddToTutor1: Array<string>;

  public refreshMultipleProgGroupData1(value: any): void {
    let progGroupIdsToAddToTutor: Array<string> = [];

    for (let i: number = 0; i < value.length; i++) {
      progGroupIdsToAddToTutor.push(value[i].id);
    }
    this.progGroupIdsToAddToTutor1 = progGroupIdsToAddToTutor;//equate to the progGroupIdsToAddToTutor1 array
    this.currentProgGroupSelectItem1 = value; //this will be used to calculate no of selected programmeGroups.
    console.log('Data =', value);
    console.log('ProgrammeGroupIdsArray =', this.progGroupIdsToAddToTutor1);
  }

  progGroupIdsToAddToTutor2: Array<string>;

  public refreshMultipleProgGroupData2(value: any): void {
    let progGroupIdsToAddToTutor: Array<string> = [];

    for (let i: number = 0; i < value.length; i++) {
      progGroupIdsToAddToTutor.push(value[i].id);
    }
    this.progGroupIdsToAddToTutor2 = progGroupIdsToAddToTutor;//equate to the progGroupIdsToAddToTutor2 array
    this.currentProgGroupSelectItem2 = value; //this will be used to calculate no of selected programmeGroups.
    console.log('Data2 =', value);
    console.log('ProgrammeGroupIdsArray2 =', this.progGroupIdsToAddToTutor2);
  }

  progGroupIdsToAddToTutor3: Array<string>;

  public refreshMultipleProgGroupData3(value: any): void {
    let progGroupIdsToAddToTutor: Array<string> = [];

    for (let i: number = 0; i < value.length; i++) {
      progGroupIdsToAddToTutor.push(value[i].id);
    }
    this.progGroupIdsToAddToTutor3 = progGroupIdsToAddToTutor;//equate to the progGroupIdsToAddToTutor3 array
    this.currentProgGroupSelectItem3 = value; //this will be used to calculate no of selected programmeGroups.
    console.log('Data3 =', value);
    console.log('ProgrammeGroupIdsArray3 =', this.progGroupIdsToAddToTutor3);
  }

  public typedProgrammeGroupChar1(value: any): void {
    console.log('Programme Group Char search input1: ', value);
  }

  public typedProgrammeGroupChar2(value: any): void {
    console.log('Programme Group Char search input2: ', value);
  }

  public typedProgrammeGroupChar3(value: any): void {
    console.log('Programme Group Char search input3: ', value);
  }

  public removedProgrammeGroup1(value: any): void {
    console.log('removed Programme Group1 is..', value);
  }

  public removedProgrammeGroup2(value: any): void {
    console.log('removed Programme Group2 is..', value);
  }

  public removedProgrammeGroup3(value: any): void {
    console.log('removed Programme Group3 is..', value);
  }


  /**
   * END OF NG-SELECT METHODS FOR UPDATING TUTORS IN DEPARTMENT
   *
   */

  updateTutorSubjectDocsIdsArray(noOfSubjectsAvailableToBeAssigned: number): void {
    let isUpdateTutorSubjectDocsIdsFormValid: Map<boolean,string> = this.isUpdateTutorSubjectDocsIdsFormValid(noOfSubjectsAvailableToBeAssigned);

    if (isUpdateTutorSubjectDocsIdsFormValid.has(true)) {
      let tutorWithUnsetTutorSubjectsAndProgrammeCodesListProperty: Tutor = this.currentTutorInDeptBeforeOpeningUpdateTutorModal;
      let finalTutorObjectToBeUpdated: Tutor =
        this.buildTutorObjectToBeUpdatedInDepartment(tutorWithUnsetTutorSubjectsAndProgrammeCodesListProperty, noOfSubjectsAvailableToBeAssigned);
    } else {
      let messageToShowToUser = isUpdateTutorSubjectDocsIdsFormValid.get(false);
      swal("Error", messageToShowToUser, "error");
      return;
    }
  }

  buildTutorObjectToBeUpdatedInDepartmentCaseONE(tutorWithUnsetTutorSubjectsAndProgrammeCodesListProperty: Tutor, noOfSubjectsAvailableToBeAssigned: number): Tutor {
    let tutorSubjectsAndProgrammeCodesList: Array<TutorSubjectIdAndProgrammeCodesListObj> = [];
    for (let i: number = 0; i < noOfSubjectsAvailableToBeAssigned; i++) {
      let tutorSubjectId: string = this.selectedSubject1;
      let tutorProgrammeCodesList: Array<string> = this.progGroupIdsToAddToTutor1;
      let tutorSubjectIdAndProgrammeCodesListObj: TutorSubjectIdAndProgrammeCodesListObj =
        new TutorSubjectIdAndProgrammeCodesListObj(tutorSubjectId, tutorProgrammeCodesList);
      tutorSubjectsAndProgrammeCodesList.push(tutorSubjectIdAndProgrammeCodesListObj);
    }

    tutorWithUnsetTutorSubjectsAndProgrammeCodesListProperty.tutorSubjectsAndProgrammeCodesList = tutorSubjectsAndProgrammeCodesList;
    console.log('Tutor with SubjectsAndProgrammeCodesList set ====>', tutorWithUnsetTutorSubjectsAndProgrammeCodesListProperty);
    return tutorWithUnsetTutorSubjectsAndProgrammeCodesListProperty;
  }

  buildTutorObjectToBeUpdatedInDepartment(tutorWithUnsetTutorSubjectsAndProgrammeCodesListProperty: Tutor, noOfSubjectsAvailableToBeAssigned: number): Tutor {
    let tutorSubjectsAndProgrammeCodesList: Array<TutorSubjectIdAndProgrammeCodesListObj> = [];
    for (let i: number = 0; i < noOfSubjectsAvailableToBeAssigned; i++) {
      let currentNo = i + 1; //add 1 as the controls range from 1 to 3,hence for consistency and readability,add 1.

      if (currentNo === 1) {
        let tutorSubjectId: string = this.selectedSubject1;
        let tutorProgrammeCodesList: Array<string> = this.progGroupIdsToAddToTutor1;
        let tutorSubjectIdAndProgrammeCodesListObj: TutorSubjectIdAndProgrammeCodesListObj =
          new TutorSubjectIdAndProgrammeCodesListObj(tutorSubjectId, tutorProgrammeCodesList);
        tutorSubjectsAndProgrammeCodesList.push(tutorSubjectIdAndProgrammeCodesListObj);
      }

      if (currentNo === 2) {
        let tutorSubjectId: string = this.selectedSubject2 || "";
        let tutorProgrammeCodesList: Array<string> = this.progGroupIdsToAddToTutor2;
        if(tutorSubjectId !== "") {
          let tutorSubjectIdAndProgrammeCodesListObj: TutorSubjectIdAndProgrammeCodesListObj =
            new TutorSubjectIdAndProgrammeCodesListObj(tutorSubjectId, tutorProgrammeCodesList);
          tutorSubjectsAndProgrammeCodesList.push(tutorSubjectIdAndProgrammeCodesListObj);
        }
      }

      if (currentNo === 3) {
        let tutorSubjectId: string = this.selectedSubject3 || "";
        let tutorProgrammeCodesList: Array<string> = this.progGroupIdsToAddToTutor3;
        if(tutorSubjectId !== "") {
          let tutorSubjectIdAndProgrammeCodesListObj: TutorSubjectIdAndProgrammeCodesListObj =
            new TutorSubjectIdAndProgrammeCodesListObj(tutorSubjectId, tutorProgrammeCodesList);
          tutorSubjectsAndProgrammeCodesList.push(tutorSubjectIdAndProgrammeCodesListObj);
        }
      }

    }

    tutorWithUnsetTutorSubjectsAndProgrammeCodesListProperty.tutorSubjectsAndProgrammeCodesList = tutorSubjectsAndProgrammeCodesList;
    console.log('Tutor with SubjectsAndProgrammeCodesList set ====>', tutorWithUnsetTutorSubjectsAndProgrammeCodesListProperty);
    return tutorWithUnsetTutorSubjectsAndProgrammeCodesListProperty;
  }

  /**
   * is everything ok before we send details to update it.
   * @param noOfSubjectsAvailableToBeAssigned
   * @param selectComponents
   */
  isUpdateTutorSubjectDocsIdsFormValid(noOfSubjectsAvailableToBeAssigned: number): Map<boolean,string> {
    let getBooleanAndMessage: Map<boolean,string> = new Map();
    switch (noOfSubjectsAvailableToBeAssigned) {
      case 1 :
        getBooleanAndMessage = this.getBooleanAndMessageWhenNoOfSubjectsIsONE(1);
        break;
      case 2 :
        getBooleanAndMessage = this.getBooleanAndMessageWhenNoOfSubjectsIsTWO(2);
        break;
      case 3 :
        getBooleanAndMessage = this.getBooleanAndMessageWhenNoOfSubjectsIsTHREE(3);
        break;
      default:
        getBooleanAndMessage = this.getBooleanAndMessageWhenNoOfSubjectsIsTHREE(3); //assume that number is more than 3 ,hence we'll use the third case scenario
    }

    return getBooleanAndMessage;
  }

  defaultBooleanAndMessage(): Map<boolean,string> {
    let booleanAndMessage: Map<boolean,string> = new Map();
    booleanAndMessage.set(false, "Incorrect details,retry with correct data");
    return booleanAndMessage;
  }

  getBooleanAndMessageWhenNoOfSubjectsIsONE(numberOne: number): Map<boolean,string> {
    let mapOfBooleanAndMessage: Map<boolean,string> = new Map();
    let selectedSubject1 = this.selectedSubject1 || "";
    if (selectedSubject1 === "") {
      mapOfBooleanAndMessage.set(false, "Choose At least one subject for subject " + numberOne);
    } else { //subject is ok,now check that the classes is at least one too
      let progGroupIdsToAddToTutor1 = this.progGroupIdsToAddToTutor1 || [];
      if (progGroupIdsToAddToTutor1.length > 0) {
        mapOfBooleanAndMessage.set(true, "Everything ok");
      } else {
        mapOfBooleanAndMessage.set(false, "Choose at least one class for subject " + numberOne);
      }
    }
    return mapOfBooleanAndMessage;
  }

  getBooleanAndMessageWhenNoOfSubjectsIsTWO(numberTwo: number): Map<boolean,string> {
    let mapValueOfCaseOne: Map<boolean,string> = this.getBooleanAndMessageWhenNoOfSubjectsIsONE(1);
    if (mapValueOfCaseOne.has(true)) {
      //once case 1 is correct,we can continue otherwise,we'll return the map for case 1
      let mapOfBooleanAndMessage: Map<boolean,string> = new Map();
      let selectedSubject2 = this.selectedSubject2 || "";
      if (selectedSubject2 === "") {
        mapOfBooleanAndMessage.set(true, "Everything is ok because selected subject is empty");
        return mapOfBooleanAndMessage;
      } else {
        //subject is ok,now check that the classes is at least one too
        let currentProgGroupSelectItem2 = this.progGroupIdsToAddToTutor2 || [];
        if (currentProgGroupSelectItem2.length > 0) {
          mapOfBooleanAndMessage.set(true, "Everything ok");
          return mapOfBooleanAndMessage;
        } else {
          mapOfBooleanAndMessage.set(false, "Choose at least one class for subject " + numberTwo+" or do not choose subject "+numberTwo+" at all.");
          return mapOfBooleanAndMessage;
        }
      }
    } else {
      return mapValueOfCaseOne;
    }
  }

  getBooleanAndMessageWhenNoOfSubjectsIsTHREE(numberThree: number): Map<boolean,string> {
    let mapValueOfCaseOne: Map<boolean,string> = this.getBooleanAndMessageWhenNoOfSubjectsIsONE(1);
    if (mapValueOfCaseOne.has(true)) {
      //once case 1 is correct,we can continue otherwise,we'll return the map for case 1
      let mapValueOfCaseTwo: Map<boolean,string> = this.getBooleanAndMessageWhenNoOfSubjectsIsTWO(2);
      if (mapValueOfCaseTwo.has(true)) {
        //once case true is also true,we can now check value three ,or else we'll return the map for case 2
        let mapOfBooleanAndMessage: Map<boolean,string> = new Map();
        let selectedsubject3 = this.selectedSubject3 || "";
        if (selectedsubject3 === "") {
          mapOfBooleanAndMessage.set(true, "Everything ok because selected subject is empty hence we assume we are not setting that subject");
          return mapOfBooleanAndMessage;
        } else {
          //selected subject is not empty hence we ensure programmeGroupIds to add to department is also not empty
          let currentProgGroupSelectItem3 = this.progGroupIdsToAddToTutor3 || [];
          if (currentProgGroupSelectItem3.length > 0) {
            mapOfBooleanAndMessage.set(true, "Everything ok");
            return mapOfBooleanAndMessage;
          } else {
            mapOfBooleanAndMessage.set(false, "Choose at least one class for subject " + numberThree + " or do not choose subject " + numberThree + " at all.");
            return mapOfBooleanAndMessage;
          }
        }
      } else {
        return mapValueOfCaseTwo;
      }
    } else {
      return mapValueOfCaseOne;
    }
  }
}
