import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {Routes, RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppComponent} from "./app.component";
import {LeftSideBarComponent} from "./components/left-side-bar/left-side-bar.component";
import {TopNavigationBarComponent} from "./components/top-navigation-bar/top-navigation-bar.component";
import {MainContentComponent} from "./components/main-content/main-content.component";
import {FooterComponent} from "./components/footer/footer.component";
import {TutorComponent} from "./components/main-content/tutor/tutor.component";
import {ProgrammeGroupComponent} from "./components/main-content/programme-group/programme-group.component";
import {SubjectComponent} from "./components/main-content/subject/subject.component";
import {DepartmentComponent} from "./components/main-content/department/department.component";
import {TimeTableComponent} from "./components/main-content/time-table/time-table.component";
import {Error404Component} from "./components/error404/error404.component";
import {TutorService} from "./services/tutor.service";
import {Ng2Bs3ModalModule} from "ng2-bs3-modal/ng2-bs3-modal";
import {SubjectService} from "./services/subject.service";
import {SubjectAllocationComponent} from "./components/main-content/subject-allocation/subject-allocation.component";
import {SubjectAllocationService} from "./services/subject-allocation.service";
import {DepartmentService} from "./services/department.service";
import {DepartmentTutorAssignmentComponent} from "./components/main-content/department-tutor-assignment/department-tutor-assignment.component";
import {SelectModule} from "ng2-select";
import {ProgrammeGroupService} from "./services/programme-group.service";
import {TutorFiltrationService} from "./services/tutor-filtration.service";
import {ProgrammeGroupFiltrationService} from "./services/programme-group-filtration.service";
import {SubjectFiltrationService} from "./services/subject-filtration.service";

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
            path: 'subjectallocate', component: SubjectAllocationComponent
          },
          {
            path: 'department', component: DepartmentComponent
          },
          {
            path: 'departmentassign', component: DepartmentTutorAssignmentComponent
          },
          {
            path: 'timetable', component: TimeTableComponent
          }
        ]
      }
    ]
  },
  {path: '**', component: Error404Component}

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
    TimeTableComponent,
    Error404Component,
    SubjectAllocationComponent,
    DepartmentTutorAssignmentComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    Ng2Bs3ModalModule,
    SelectModule
  ],
  providers: [
    TutorService,
    SubjectService,
    SubjectAllocationService,
    DepartmentService,
    ProgrammeGroupService,
    TutorFiltrationService,
    ProgrammeGroupFiltrationService,
    SubjectFiltrationService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
