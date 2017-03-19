import {Component, OnInit, ViewChild} from "@angular/core";
import {TimeTableGenerationService} from "../../../services/time-table-generation.service";
import {FormBuilder, FormGroup, Validators, AbstractControl} from "@angular/forms";
import {ModalComponent} from "ng2-bs3-modal/components/modal";
import {TimeTableGenerationRequest} from "../../../models/time-table-generation-request";
import {TimeTableMainEntity} from "../../../models/time-table-main-entity";
import {TimeTableMainEntityResponsePayload} from "../../../models/time-table-main-entity-response-payload";
import {ProgrammeGroupPersonalTimeTableEntity} from "../../../models/programme-group-personal-time-table-entity";
import {TutorPersonalTimeTableEntity} from "../../../models/tutor-personal-time-table-entity";

declare var swal: any;
@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.css'],
  providers: [TimeTableGenerationService]
})
export class TimeTableComponent implements OnInit {

  @ViewChild('modalGenerateTimeTableDialog')
  modalGenerateTimeTableDialog: ModalComponent;
  generateTimeTableForm: FormGroup;
  formIsValid: boolean = false;
  accessingService: boolean = false;
  isGenerateButtonWandVisible: boolean = true;

  successfullyGeneratedTimeTableMainEntity: TimeTableMainEntity;
  programmeGroupPersonalTimeTableDocsList : Array<ProgrammeGroupPersonalTimeTableEntity>;
  tutorPersonalTimeTableDocsList : Array<TutorPersonalTimeTableEntity>;

  constructor(private timeTableGenerationService: TimeTableGenerationService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buildGenerateTimeTableForm();
  }

  openGenerateTimeTableSubjectModal(): void {
    this.modalGenerateTimeTableDialog.open();
  }

  generateTimeTable(generateTimeTableForm: AbstractControl): void {
    this.accessingService = true;

    let timeTableName: string = generateTimeTableForm.value.timeTableName;
    let timeTableYear: number = generateTimeTableForm.value.timeTableYear;
    let timeTableGenerationRequest: TimeTableGenerationRequest =
      new TimeTableGenerationRequest(timeTableName, timeTableYear);

    console.log("TimeTable Generation Request ==>", timeTableGenerationRequest);
    this.isGenerateButtonWandVisible = false;
    // this.timeTableGenerationService.generateTimeTable(timeTableGenerationRequest).subscribe(
    //   (response: TimeTableMainEntityResponsePayload) => {
    //     this.accessingService = false;
    //     console.info("response status = " + response.status);
    //     if (response.status === 0) {
    //       this.isGenerateButtonWandVisible = false;//once the response status is 0,we can hide the generate button.
    //       response.responseObject = this.successfullyGeneratedTimeTableMainEntity;
    //       this.modalGenerateTimeTableDialog.dismiss();
    //       swal("Success", "Subject Added Successfully", "success");
    //     } else {
    //       swal("Error", response.message || "Error", "error");
    //     }
    //   },
    //   (error: any) => {
    //     this.accessingService = false;
    //     swal("Error", "Something went wrong,Try Again", "error");
    //     console.log(error);
    //   }
    // );
  }

  /**
   * ID of programmeGroup Type of timetable used in ng-select library
   * @type {number}
   */
  TIMETABLE_TYPE_PROGRAMMEGROUP : number = 0;
  TIMETABLE_TYPE_TUTOR : number = 1;
  /**
   * ng-select library takes data in the form of {id,text} objects.
   *
   * @returns {Array<any>}
   */
  public getTimeTableTypesItems(): Array<any> {
    let timeTableTypes: Array<any> = [];

    let timeTableType1: any = {
      id: this.TIMETABLE_TYPE_PROGRAMMEGROUP,
      text: 'Classes/ProgrammeGroups TimeTable'
    };
    let timeTableType2: any = {
      id: this.TIMETABLE_TYPE_TUTOR,
      text: 'Tutors TimeTable'
    };
    timeTableTypes.push([timeTableType1, timeTableType2]);

    console.info('TimeTable Type Objects to be populated in dropdown: ', timeTableTypes);
    return timeTableTypes;
  }

  buildGenerateTimeTableForm(): void {
    this.generateTimeTableForm = this.formBuilder.group(
      {
        'timeTableYear': ['',
          Validators.required],
        'timeTableName': ['',
          Validators.required]
      },
    );

    this.generateTimeTableForm.valueChanges
      .subscribe(data => this.onGenerataTimeTableFormValueChanged(data));
    this.onGenerataTimeTableFormValueChanged(); // (re)set validation messages now
  }

  private onGenerataTimeTableFormValueChanged(data?: any): void {
    if (!this.generateTimeTableForm) {
      return;
    }
    const form = this.generateTimeTableForm;

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
      } else if (control && control.dirty && control.valid) {
        this.formIsValid = true;
      }
    }
  }

  formErrors = {
    'timeTableYear': '',
    'timeTableName': ''

  };

  validationMessages = {
    'timeTableYear': {
      'required': 'Timetable year is required.'
    },
    'timeTableName': {
      'required': 'Timetable year is required.'
    }
  };

  public selectedTimeTableType(value: any): void {
    console.log('Selected value is: ', value);
    console.log('value id=', value.id);

    switch (value.id) {
      case this.TIMETABLE_TYPE_PROGRAMMEGROUP :
        //DO IMPLEMENTATION TO SHOW ALL TIMETABLE FOR ALL PROGRAMMEGROUPS RETURNED FROM SERVICE
        this.getProgrammeGroupsTimeTables(this.successfullyGeneratedTimeTableMainEntity.programmeGroupPersonalTimeTableDocs);
        break;
      case this.TIMETABLE_TYPE_TUTOR :
        //DO IMPLEMENTATION TO SHOW ALL TIMETABLE FOR ALL TUTORS RETURNED FROM SERVICE.
        this.getTutorsTimeTables(this.successfullyGeneratedTimeTableMainEntity.tutorPersonalTimeTableDocs);
        break;
      default :
        //DEFAULT IMPLEMENTAION
        break;

    }
  }

  /**
   * programmeGroups timetables list
   * @param programmeGroupPersonalTimeTableDocs {@link TimeTableMainEntity.programmeGroupPersonalTimeTableDocs}
   */
  getProgrammeGroupsTimeTables(programmeGroupPersonalTimeTableDocs: Array<ProgrammeGroupPersonalTimeTableEntity>){
    this.programmeGroupPersonalTimeTableDocsList = programmeGroupPersonalTimeTableDocs;
  }

  getTutorsTimeTables(tutorPersonalTimeTableDocs : Array<TutorPersonalTimeTableEntity>){
    this.tutorPersonalTimeTableDocsList = tutorPersonalTimeTableDocs;
  }
}
