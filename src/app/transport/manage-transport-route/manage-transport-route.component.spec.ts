import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTransportRouteComponent } from './manage-transport-route.component';

describe('ManageTransportRouteComponent', () => {
  let component: ManageTransportRouteComponent;
  let fixture: ComponentFixture<ManageTransportRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageTransportRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTransportRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
