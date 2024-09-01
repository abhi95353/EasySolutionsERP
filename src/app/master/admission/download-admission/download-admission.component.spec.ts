import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAdmissionComponent } from './download-admission.component';

describe('DownloadAdmissionComponent', () => {
  let component: DownloadAdmissionComponent;
  let fixture: ComponentFixture<DownloadAdmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadAdmissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
