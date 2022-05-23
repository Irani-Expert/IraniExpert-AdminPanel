import { TestBed } from '@angular/core/testing';
import { UserNeedService } from './user-need.service';

describe('UserNeedService', () => {
  let service: UserNeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserNeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
