import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCenterComponent } from './upload-center.component';

describe('UploadCenterComponent', () => {
  let component: UploadCenterComponent;
  let fixture: ComponentFixture<UploadCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadCenterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
