import {Injectable} from "@angular/core";
import {Tutor} from "../models/TutorResponsePayload";

@Injectable()
export class TutorFiltrationService {

  constructor() {
  }

  /**
   * remove tutors that have been assigned to a department already,
   * it is possible that after filtration,the number of tutors could be zero,hence ensure that
   * the number of tutors is not zero,before usage in component.
   * @param tutors
   * @returns {Array<Tutor>}
   */
  filterTutorsAlreadyAssignedToDepartment(tutors: Array<Tutor>): Array<Tutor> {
    if (tutors.length === 0) {
      return tutors;
    } else {
      console.log('Incoming Raw Tutors =>', tutors);
      let tutorsFiltered: Array<Tutor> = [];
      for (let i: number = 0; i < tutors.length; i++) {
        let currentTutor: Tutor = tutors[i];
        if (currentTutor.departmentId === "undefined" || currentTutor.departmentId === "" || currentTutor.departmentId === null) {
          tutorsFiltered.push(currentTutor);
        }
      }
      console.log('Tutors with Already Assigned Tutors Removed::::::', tutorsFiltered);
      return tutorsFiltered;
    }
  }

}
