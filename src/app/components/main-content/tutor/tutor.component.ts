import { Component, OnInit } from '@angular/core';
import {TutorService} from "../../../services/tutor.service";

@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.css'],
  providers:[TutorService]
})
export class TutorComponent implements OnInit {

  tutorService : TutorService;

  constructor(tutorService:TutorService) {
    this.tutorService = tutorService;
  }

  ngOnInit() {
  }

}
