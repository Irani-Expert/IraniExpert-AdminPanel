import { TestBed } from '@angular/core/testing';

import { BackTestService } from './back-test.service';

describe('BackTestService', () => {
  let service: BackTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
