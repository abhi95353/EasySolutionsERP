import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNoticComponent } from './create-notic.component';

describe('CreateNoticComponent', () => {
  let component: CreateNoticComponent;
  let fixture: ComponentFixture<CreateNoticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNoticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNoticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
