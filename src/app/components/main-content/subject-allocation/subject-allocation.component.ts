import {Component, OnInit} from "@angular/core";
import {SubjectService} from "../../../services/subject.service";
import {SubjectEntity} from "../../../models/subject-entity";
import {SubjectAllocationService} from "../../../services/subject-allocation.service";
import {GeneralResponsePayload} from "../../../models/general-response-payload";
import {Router} from "@angular/router";
declare var swal: any;
@Component({
  selector: 'app-subject-allocation',
  templateUrl: './subject-allocation.component.html',
  styleUrls: ['./subject-allocation.component.css'],
  providers: [SubjectService, SubjectAllocationService]
})
export class SubjectAllocationComponent implements OnInit {

  noOfSubjects: number;
  isSubjectsListEmpty: boolean = false;
  noOfUnallocatedSubjects:number;
  noOfAllocatedSubjects:number;
  subjects: Array<SubjectEntity>;

  constructor(public subjectAllocationService: SubjectAllocationService,public router:Router) {
  }

  ngOnInit() {
    this.getAllSubjectsAndTheirAllocationState();
  }


  getAllSubjectsAndTheirAllocationState() {
    this.subjectAllocationService.getAllSubjectsAllocationState().subscribe(
      (response: GeneralResponsePayload) => {
        console.info(response);
        if (response.status === 0) {
          this.subjects = response.responseObject;
          if (this.subjects.length > 0) {
            this.calculateNumberOfAllocatedSubjects(this.subjects);
            this.isSubjectsListEmpty = false;
            this.noOfSubjects = this.subjects.length;
          } else {
            this.isSubjectsListEmpty = true;
          }
        } else {
          swal("Error", "Something went wrong,try again.", "error");
        }
      },
      (error: any) => {
        swal("Error", "Ensure you have a working internet connection", "error");
        console.log(error);
      }
    );
  }

  calculateNumberOfAllocatedSubjects(subjects:Array<SubjectEntity>):void{
    let allocatedSubjects:Array<SubjectEntity> = [];
    let unAllocatedSubjects:Array<SubjectEntity> = [];
    subjects.forEach(
      (subject)=>{
      if(subject.isAllSubjectYearGroupsAllocated === true) {
        allocatedSubjects.push(subject);
      }else{
        unAllocatedSubjects.push(subject);
      }
    });
    this.noOfAllocatedSubjects = allocatedSubjects.length;
    this.noOfUnallocatedSubjects = unAllocatedSubjects.length;
    console.info('AllocatedSubjects ='+this.noOfAllocatedSubjects+' Unallocated='+this.noOfUnallocatedSubjects);
  }

  goToSubjectsPane():void{
    this.router.navigate([('home/subject')]);
  }

}
