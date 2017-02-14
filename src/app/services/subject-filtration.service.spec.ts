/* tslint:disable:no-unused-variable */

import {TestBed, async, inject} from '@angular/core/testing';
import {SubjectFiltrationService} from './subject-filtration.service';

describe('SubjectFiltrationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubjectFiltrationService]
    });
  });

  it('should ...', inject([SubjectFiltrationService], (service: SubjectFiltrationService) => {
    expect(service).toBeTruthy();
  }));
});
