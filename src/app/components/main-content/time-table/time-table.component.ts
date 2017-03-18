import {Component, OnInit, ViewChild} from "@angular/core";
import {TimeTableGenerationService} from "../../../services/time-table-generation.service";
import {FormBuilder, FormGroup, Validators, AbstractControl} from "@angular/forms";
import {ModalComponent} from "ng2-bs3-modal/components/modal";
import {TimeTableGenerationRequest} from "../../../models/time-table-generation-request";
import {TimeTableMainEntity} from "../../../models/time-table-main-entity";
import {TimeTableMainEntityResponsePayload} from "../../../models/time-table-main-entity-response-payload";

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

    console.log("TimeTable Generation Request ==>",timeTableGenerationRequest);
    this.timeTableGenerationService.generateTimeTable(timeTableGenerationRequest).subscribe(
      (response: TimeTableMainEntityResponsePayload) => {
        this.accessingService = false;
        console.info("response status = " + response.status);
        if (response.status === 0) {
          this.modalGenerateTimeTableDialog.dismiss();
          this.ngOnInit();
          swal("Success", "Subject Added Successfully", "success");
        } else {
          swal("Error", response.message||"Error", "error");
        }
      },
      (error: any) => {
        this.accessingService = false;
        swal("Error", "Something went wrong,Try Again", "error");
        console.log(error);
      }
    );
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
}
