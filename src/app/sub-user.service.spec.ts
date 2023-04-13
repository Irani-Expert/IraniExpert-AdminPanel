import { TestBed } from '@angular/core/testing';

import { SubUserService } from './sub-user.service';

describe('SubUserService', () => {
  let service: SubUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
