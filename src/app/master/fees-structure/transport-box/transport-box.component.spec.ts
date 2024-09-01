import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportBoxComponent } from './transport-box.component';

describe('TransportBoxComponent', () => {
  let component: TransportBoxComponent;
  let fixture: ComponentFixture<TransportBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
