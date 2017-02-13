/* tslint:disable:no-unused-variable */

import {TestBed, async, inject} from '@angular/core/testing';
import {TutorFiltrationService} from './tutor-filtration.service';

describe('TutorFiltrationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TutorFiltrationService]
    });
  });

  it('should ...', inject([TutorFiltrationService], (service: TutorFiltrationService) => {
    expect(service).toBeTruthy();
  }));
});
