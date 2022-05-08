import { TestBed } from '@angular/core/testing';

import { LeranService } from './leran.service';

describe('LeranService', () => {
  let service: LeranService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeranService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
