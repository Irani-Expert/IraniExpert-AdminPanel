import { TestBed } from '@angular/core/testing';

import { PlanOptionService } from './plan-option.service';

describe('PlanOptionService', () => {
  let service: PlanOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanOptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
