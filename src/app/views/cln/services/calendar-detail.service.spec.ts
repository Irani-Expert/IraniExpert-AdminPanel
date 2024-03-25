import { TestBed } from '@angular/core/testing';

import { CalendarDetailService } from './calendar-detail.service';

describe('CalendarDetailService', () => {
  let service: CalendarDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
