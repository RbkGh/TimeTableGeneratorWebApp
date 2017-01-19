/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SubjectAllocationService } from './subject-allocation.service';

describe('SubjectAllocationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubjectAllocationService]
    });
  });

  it('should ...', inject([SubjectAllocationService], (service: SubjectAllocationService) => {
    expect(service).toBeTruthy();
  }));
});
