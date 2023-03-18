import { TestBed } from '@angular/core/testing';

import { ConditionServiceService } from './condition-service.service';

describe('ConditionServiceService', () => {
  let service: ConditionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConditionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
