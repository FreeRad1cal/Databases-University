import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplicationsResultComponent } from './job-applications-result.component';

describe('JobApplicationsResultComponent', () => {
  let component: JobApplicationsResultComponent;
  let fixture: ComponentFixture<JobApplicationsResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobApplicationsResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobApplicationsResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
