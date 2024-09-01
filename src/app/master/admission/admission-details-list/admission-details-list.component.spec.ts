import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionDetailsListComponent } from './admission-details-list.component';

describe('AdmissionDetailsListComponent', () => {
  let component: AdmissionDetailsListComponent;
  let fixture: ComponentFixture<AdmissionDetailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmissionDetailsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissionDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
