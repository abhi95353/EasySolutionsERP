import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionFeeCollectComponent } from './admission-fee-collect.component';

describe('AdmissionFeeCollectComponent', () => {
  let component: AdmissionFeeCollectComponent;
  let fixture: ComponentFixture<AdmissionFeeCollectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmissionFeeCollectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissionFeeCollectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
