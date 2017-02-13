/* tslint:disable:no-unused-variable */

import {TestBed, async, inject} from '@angular/core/testing';
import {ProgrammeGroupFiltrationService} from './programme-group-filtration.service';

describe('ProgrammeGroupFiltrationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProgrammeGroupFiltrationService]
    });
  });

  it('should ...', inject([ProgrammeGroupFiltrationService], (service: ProgrammeGroupFiltrationService) => {
    expect(service).toBeTruthy();
  }));
});
