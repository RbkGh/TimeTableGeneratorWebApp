import { Component, OnInit } from '@angular/core';
import {FooterComponent} from "../footer/footer.component";

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.css'],
  viewProviders:[FooterComponent]
})
export class Error404Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
