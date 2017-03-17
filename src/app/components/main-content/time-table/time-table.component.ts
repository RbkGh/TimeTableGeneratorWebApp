import {Component, OnInit} from "@angular/core";
import {TimeTableGenerationService} from "../../../services/time-table-generation.service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.css'],
  providers: [TimeTableGenerationService]
})
export class TimeTableComponent implements OnInit {

  constructor(private timeTableGenerationService: TimeTableGenerationService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
  }

}
