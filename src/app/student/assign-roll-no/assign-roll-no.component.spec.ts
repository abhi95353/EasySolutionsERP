import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRollNoComponent } from './assign-roll-no.component';

describe('AssignRollNoComponent', () => {
  let component: AssignRollNoComponent;
  let fixture: ComponentFixture<AssignRollNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignRollNoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignRollNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
