/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProgrammeGroupService } from './programme-group.service';

describe('ProgrammeGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProgrammeGroupService]
    });
  });

  it('should ...', inject([ProgrammeGroupService], (service: ProgrammeGroupService) => {
    expect(service).toBeTruthy();
  }));
});
