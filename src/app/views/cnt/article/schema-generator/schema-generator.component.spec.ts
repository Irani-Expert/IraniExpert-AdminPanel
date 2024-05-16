import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaGeneratorComponent } from './schema-generator.component';

describe('SchemaGeneratorComponent', () => {
  let component: SchemaGeneratorComponent;
  let fixture: ComponentFixture<SchemaGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemaGeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemaGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
