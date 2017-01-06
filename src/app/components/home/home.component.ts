import { Component, OnInit } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {LeftSideBarComponent} from "../left-side-bar/left-side-bar.component";
import {FooterComponent} from "../footer/footer.component";
import {TopNavigationBarComponent} from "../top-navigation-bar/top-navigation-bar.component";
import {MainContentComponent} from "../main-content/main-content.component";
import {TutorService} from "../../services/tutor.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  viewProviders : [
    LeftSideBarComponent,
    FooterComponent,
    TopNavigationBarComponent,
    MainContentComponent
  ],
  providers:[TutorService]
})
export class HomeComponent implements OnInit,CanActivate {

  constructor() { }

  ngOnInit() {
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    return true;
  }
}
