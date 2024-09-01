import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportRouteComponent } from './transport-route.component';

describe('TransportRouteComponent', () => {
  let component: TransportRouteComponent;
  let fixture: ComponentFixture<TransportRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
