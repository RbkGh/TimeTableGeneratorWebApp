/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SubjectService } from './subject.service';

describe('SubjectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubjectService]
    });
  });

  it('should ...', inject([SubjectService], (service: SubjectService) => {
    expect(service).toBeTruthy();
  }));
});
