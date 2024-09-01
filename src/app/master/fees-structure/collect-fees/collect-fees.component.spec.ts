import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectFeesComponent } from './collect-fees.component';

describe('CollectFeesComponent', () => {
  let component: CollectFeesComponent;
  let fixture: ComponentFixture<CollectFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectFeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
