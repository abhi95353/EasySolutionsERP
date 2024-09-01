import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousDueCollectComponent } from './previous-due-collect.component';

describe('PreviousDueCollectComponent', () => {
  let component: PreviousDueCollectComponent;
  let fixture: ComponentFixture<PreviousDueCollectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviousDueCollectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousDueCollectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
