import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeOptionComponent } from './cheque-option.component';

describe('ChequeOptionComponent', () => {
  let component: ChequeOptionComponent;
  let fixture: ComponentFixture<ChequeOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
