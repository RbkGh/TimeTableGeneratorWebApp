/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DepartmentService } from './department.service';

describe('DepartmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DepartmentService]
    });
  });

  it('should ...', inject([DepartmentService], (service: DepartmentService) => {
    expect(service).toBeTruthy();
  }));
});
