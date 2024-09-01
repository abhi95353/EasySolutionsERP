import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStudentFacilityComponent } from './manage-student-facility.component';

describe('ManageStudentFacilityComponent', () => {
  let component: ManageStudentFacilityComponent;
  let fixture: ComponentFixture<ManageStudentFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageStudentFacilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStudentFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
