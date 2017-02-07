import {Component, OnInit, ViewChild, EventEmitter} from "@angular/core";
import {ProgrammeGroupService} from "../../../services/programme-group.service";
import {ProgrammeGroupEntity} from "../../../models/programme-group-entity";
import {ModalComponent} from "ng2-bs3-modal/components/modal";
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {ProgrammeGroupArrayResponsePayload} from "../../../models/programme-group-array-response-payload";
import {SelectItem} from "ng2-select";

declare var swal: any;
@Component({
  selector: 'app-programme-group',
  templateUrl: './programme-group.component.html',
  styleUrls: ['./programme-group.component.css'],
  providers: [ProgrammeGroupService]
})
export class ProgrammeGroupComponent implements OnInit {

  noOfProgrammeGroups: number;
  formIsValid: boolean;
  isProgrammeGroupListEmpty: boolean = false;
  programmeGroups: Array<ProgrammeGroupEntity>;
  yearGroupList: Array<number>;

  @ViewChild('modalAddProgrammeGroup')
  modalAddProgrammeGroup: ModalComponent;

  addProgrammeGroupForm: FormGroup;

  constructor(private programmeGroupService: ProgrammeGroupService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getAllProgrammeGroups();
    this.buildAddDepartmentForm();
  }

  refreshPage(): void {
    this.ngOnInit();
  }

  openAddProgrammeGroupModal(): void {
    this.modalAddProgrammeGroup.open();

  }

  deleteProgrammeGroup(programmeGroupId: string): void {

    swal({
        title: "Are you sure?",
        text: "This will delete Programme Permanently!!",
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
          this.programmeGroupService.deleteProgrammeGroup(programmeGroupId)
            .subscribe(
              (r) => {
                if (r.status === 0) {
                  this.ngOnInit();
                  swal("Successful", "Programme deleted successfully", "success");
                } else {
                  swal("Error", r.message, "error");
                }
              },
              error => {
                swal("Error", "Something went wrong.Try again", "error");
              }
            );

        } else {
          swal("Cancelled", "Programme was not deleted", "error");
        }
      });
  }

  getAllProgrammeGroups(): void {
    this.programmeGroupService.getAllProgrammeGroups()
      .subscribe(
        r => {
          if (r.status === 0) {
            if (r.responseObject.length === 0) {
              this.isProgrammeGroupListEmpty = true;
            } else {
              this.isProgrammeGroupListEmpty = false;
              this.noOfProgrammeGroups = r.responseObject.length;
              this.programmeGroups = r.responseObject;
            }
          } else {
            swal("Error", r.message || "Please Try Again Later", "error");
          }
        },
        error => {
          swal("Something went wrong", "Please Try Again", "error");
        }
      );
  }

  buildAddDepartmentForm(): void {
    this.addProgrammeGroupForm = this.formBuilder.group({});
    this.addProgrammeGroupForm.addControl('programmeFullName', new FormControl('', Validators.required));
    this.addProgrammeGroupForm.addControl('programmeInitials', new FormControl('', Validators.required));
    this.addProgrammeGroupForm.addControl('numberOfClasses', new FormControl('', Validators.required));
    this.addProgrammeGroupForm.addControl('technicalWorkshopOrLabRequired', new FormControl('',
      Validators.compose([Validators.required])));

    this.addProgrammeGroupForm.valueChanges.subscribe(
      data => {
        this.onAddProgrammeGroupValueChanged(data)
      }
    );

    this.onAddProgrammeGroupValueChanged(); //reset validation messages
  }

  addProgrammeGroup(addProgrammeGroupForm: FormGroup): void {
    let yearGroupList = this.yearGroupList;
    let numberOfClasses = addProgrammeGroupForm.value.numberOfClasses;
    let programmeFullName = addProgrammeGroupForm.value.programmeFullName;
    let programmeInitials = addProgrammeGroupForm.value.programmeInitials;
    let technicalWorkshopOrLabRequired = addProgrammeGroupForm.value.technicalWorkshopOrLabRequired;

    let programmeGroupEntities: Array<ProgrammeGroupEntity> = [];
    //no yearGroup starts from 0 hence start loop from 1 instead of 0
    for (let i: number = 1; i <= yearGroupList.length; i++) {

      for (let iNum: number = 1; iNum <= numberOfClasses; iNum++) {
        let programmeGroupEntity: ProgrammeGroupEntity = new ProgrammeGroupEntity(null,
          programmeFullName,
          programmeInitials,
          i,//set yearGroup of current entity to current index,i
          null,
          yearGroupList,
          technicalWorkshopOrLabRequired);

        programmeGroupEntities.push(programmeGroupEntity);
      }

    }
    console.log('Final ProgrammeGroup Entities = ', programmeGroupEntities);

    this.programmeGroupService.createProgrammeGroup(programmeGroupEntities).subscribe(
      (r: ProgrammeGroupArrayResponsePayload) => {
        if (r.status === 0) {
          this.modalAddProgrammeGroup.dismiss();
          this.ngOnInit();
          swal("Success", "Programme Added Successfully", "success");
        } else {
          swal("Error", r.message, "error");
        }
      },
      (error: any) => {
        swal("Error", "Something went wrong,please Try Again", "error");
      }
    );
  }

  public selectedYearGroup(value: any): void {
    console.log('Selected value is: ', value);
    console.log('value id=', value.id);
  }

  public removedYearGroup(value: EventEmitter<SelectItem>): void {
    console.log('Value of removed item  *****', value);
  }

  public refreshValueMultiple(value: any): void {
    let yearGroupList: Array<number> = [];

    for (let i: number = 0; i < value.length; i++) {
      yearGroupList.push(value[i].id);
    }
    this.yearGroupList = yearGroupList;
    console.log('Data =', value);
    console.log('YearGroupList =', this.yearGroupList);
  }

  /**
   * ng-select library takes data in the form of {id,text} objects.
   *
   * @returns {Array<any>}
   */
  getYearGroupItems(): Array<any> {
    let yearGroupItems: Array<any> = [];
    for (let i: number = 1; i <= 3; i++) {
      yearGroupItems[i] = {
        id: i,
        text: 'FORM ' + i
      };
    }
    console.info('YearGroup Objects to be populated in dropdown: ', yearGroupItems);
    return yearGroupItems;
  }

  onAddProgrammeGroupValueChanged(data?: any): void {
    if (!this.addProgrammeGroupForm) {
      return;
    }
    const form = this.addProgrammeGroupForm;

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
    'programmeFullName': '',
    'programmeInitials': '',
    'yearGroup': '',
    'yearGroupList': '',
    'numberOfClasses': '',
    'technicalWorkshopOrLabRequired': ''
  };
  validationMessages = {
    'programmeFullName': {
      'required': 'Programme Full Name is required.'
    },
    'programmeInitials': {
      'required': 'Department Name is required.'
    },
    'yearGroup': {
      'required': 'YearGroup is required.'
    },
    'yearGroupList': {
      'required': 'Field is required'
    },
    'numberOfClasses': {
      'required': 'Number of classes is required',
      'min': 'At least one is required',
      'max': 'Maximum number of classes is 7',
    },
    'technicalWorkshopOrLabRequired': {
      'required': 'Field is required.'
    }
  };

}
