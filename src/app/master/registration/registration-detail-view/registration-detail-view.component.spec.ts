import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationDetailViewComponent } from './registration-detail-view.component';

describe('RegistrationDetailViewComponent', () => {
  let component: RegistrationDetailViewComponent;
  let fixture: ComponentFixture<RegistrationDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
