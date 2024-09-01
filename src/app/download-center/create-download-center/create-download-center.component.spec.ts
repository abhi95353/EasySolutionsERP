import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDownloadCenterComponent } from './create-download-center.component';

describe('CreateDownloadCenterComponent', () => {
  let component: CreateDownloadCenterComponent;
  let fixture: ComponentFixture<CreateDownloadCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDownloadCenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDownloadCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
