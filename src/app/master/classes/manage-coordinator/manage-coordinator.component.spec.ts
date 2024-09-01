import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCoordinatorComponent } from './manage-coordinator.component';

describe('ManageCoordinatorComponent', () => {
  let component: ManageCoordinatorComponent;
  let fixture: ComponentFixture<ManageCoordinatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCoordinatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCoordinatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
