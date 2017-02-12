import {Component, OnInit} from '@angular/core';
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {Router} from "@angular/router";

/**
 * TODO DISABLE REASSIGNING DEPARTMENT HEAD TO DIFFERENT DEPT HEAD ,CURRENTLY SETTING THIS REMOVES
 * DEPARTMENT HEAD AND THERE IS NO OPTION TO RESTORE IT.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  viewProviders : [ LoginComponent,HomeComponent]
})
export class AppComponent implements OnInit{
  title = 'app works!';

  constructor(private router : Router) {
  }

  ngOnInit(): void {
    this.router.navigate([('login')]);
  }
}
