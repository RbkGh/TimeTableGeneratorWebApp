import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {Routes, RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {AppComponent} from "./app.component";
import {LeftSideBarComponent} from "./components/left-side-bar/left-side-bar.component";
import {TopNavigationBarComponent} from "./components/top-navigation-bar/top-navigation-bar.component";
import {MainContentComponent} from "./components/main-content/main-content.component";
import {FooterComponent} from "./components/footer/footer.component";
import {TutorComponent} from "./components/main-content/tutor/tutor.component";
import {ProgrammeGroupComponent} from './components/main-content/programme-group/programme-group.component';
import {SubjectComponent} from './components/main-content/subject/subject.component';
import {DepartmentComponent} from './components/main-content/department/department.component';
import {TimeTableComponent} from './components/main-content/time-table/time-table.component';

const appRoutes: Routes = [
  {
    path: '', component: AppComponent,
    children: [
      {
        path: 'login', component: LoginComponent
      },
      {
        path: 'home', component: HomeComponent,
        children: [
          {
            path: 'tutor', component: TutorComponent
          },
          {
            path: 'programmegroup', component: ProgrammeGroupComponent
          },
          {
            path: 'subject', component: SubjectComponent
          },
          {
            path: 'department', component: DepartmentComponent
          },
          {
            path: 'timetable', component: TimeTableComponent
          }
        ]
      }
    ]
  }

];
@NgModule({
  declarations: [
    LoginComponent,
    HomeComponent,
    AppComponent,
    TopNavigationBarComponent,
    LeftSideBarComponent,
    MainContentComponent,
    FooterComponent,
    TutorComponent,
    ProgrammeGroupComponent,
    SubjectComponent,
    DepartmentComponent,
    TimeTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
