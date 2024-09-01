import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDueCertificateComponent } from './no-due-certificate.component';

describe('NoDueCertificateComponent', () => {
  let component: NoDueCertificateComponent;
  let fixture: ComponentFixture<NoDueCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoDueCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoDueCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
