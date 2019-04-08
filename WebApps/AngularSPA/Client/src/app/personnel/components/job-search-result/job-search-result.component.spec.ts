import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSearchResultComponent } from './job-search-result.component';

describe('JobSearchResultComponent', () => {
  let component: JobSearchResultComponent;
  let fixture: ComponentFixture<JobSearchResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobSearchResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
