import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentAssoChildComponent } from './parent-asso-child.component';

describe('ParentAssoChildComponent', () => {
  let component: ParentAssoChildComponent;
  let fixture: ComponentFixture<ParentAssoChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentAssoChildComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentAssoChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
