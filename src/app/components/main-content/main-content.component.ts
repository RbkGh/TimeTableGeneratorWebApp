import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {TutorComponent} from "./tutor/tutor.component";

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css'],
  viewProviders : [TutorComponent]
})
export class MainContentComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
    this.router.navigate([('tutor')]);
  }

}
