import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffCertificateComponent } from './staff-certificate.component';

describe('StaffCertificateComponent', () => {
  let component: StaffCertificateComponent;
  let fixture: ComponentFixture<StaffCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
