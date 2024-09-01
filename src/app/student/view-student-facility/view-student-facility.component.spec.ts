import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentFacilityComponent } from './view-student-facility.component';

describe('ViewStudentFacilityComponent', () => {
  let component: ViewStudentFacilityComponent;
  let fixture: ComponentFixture<ViewStudentFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStudentFacilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudentFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
