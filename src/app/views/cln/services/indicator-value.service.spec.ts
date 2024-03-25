import { TestBed } from '@angular/core/testing';

import { IndicatorValueService } from './indicator-value.service';

describe('IndicatorValueService', () => {
  let service: IndicatorValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndicatorValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
