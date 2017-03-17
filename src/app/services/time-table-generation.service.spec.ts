/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TimeTableGenerationService } from './time-table-generation.service';

describe('TimeTableGenerationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeTableGenerationService]
    });
  });

  it('should ...', inject([TimeTableGenerationService], (service: TimeTableGenerationService) => {
    expect(service).toBeTruthy();
  }));
});
