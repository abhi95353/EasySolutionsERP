import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeCarryForwordComponent } from './fee-carry-forword.component';

describe('FeeCarryForwordComponent', () => {
  let component: FeeCarryForwordComponent;
  let fixture: ComponentFixture<FeeCarryForwordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeCarryForwordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeCarryForwordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
