import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualSmsComponent } from './manual-sms.component';

describe('ManualSmsComponent', () => {
  let component: ManualSmsComponent;
  let fixture: ComponentFixture<ManualSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualSmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
