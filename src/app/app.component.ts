import {Component, OnInit} from '@angular/core';
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {Router} from "@angular/router";


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
