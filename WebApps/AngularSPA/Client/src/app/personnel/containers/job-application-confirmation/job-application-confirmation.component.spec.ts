import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplicationConfirmationComponent } from './job-application-confirmation.component';

describe('JobApplicationConfirmationComponent', () => {
  let component: JobApplicationConfirmationComponent;
  let fixture: ComponentFixture<JobApplicationConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobApplicationConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobApplicationConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
