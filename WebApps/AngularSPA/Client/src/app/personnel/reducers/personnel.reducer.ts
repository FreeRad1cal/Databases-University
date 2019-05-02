import { JobPosting } from '../models/JobPosting';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { JobTitle } from '../models/JobTitle';
import { PersonnelActionsUnion, PersonnelActionTypes } from '../actions/personnel-actions';
import { JobApplication } from '../models/JobApplication';

interface JobTitleState extends EntityState<JobTitle> {
    total: number;
}

interface JobPostingState extends EntityState<JobPosting> {
    total: number;
}

interface JobApplicationState extends EntityState<JobApplication> {
    total: number;
}

export interface State {
    jobTitles: JobTitleState,
    jobPostings: JobPostingState,
    jobApplications: JobApplicationState
}

export const jobTitlesAdapter: EntityAdapter<JobTitle> = createEntityAdapter<JobTitle>({selectId: jobTitle => jobTitle.name});
export const jobPostingsAdapter: EntityAdapter<JobPosting> = createEntityAdapter<JobPosting>();
export const jobApplicationsAdapter: EntityAdapter<JobApplication> = createEntityAdapter<JobApplication>();

export const initialState: State = {
    jobTitles: jobTitlesAdapter.getInitialState({total: null}),
    jobPostings: jobPostingsAdapter.getInitialState({total: null}),
    jobApplications: jobApplicationsAdapter.getInitialState({total: null})
};

export function reducer(state = initialState, action: PersonnelActionsUnion): State {
    switch (action.type) {
        case PersonnelActionTypes.AddJobTitles:
        {
            let newState = { ...state };
            newState.jobTitles = jobTitlesAdapter.upsertMany(action.payload.jobTitles, state.jobTitles);
            if (action.payload.total) {
                newState.jobTitles.total = action.payload.total;
            }
            return newState;
        }
        case PersonnelActionTypes.AddJobPostings:
        {
            let jobPostingsState = { ...jobPostingsAdapter.upsertMany(action.payload.jobPostings, state.jobPostings) };
            if (action.payload.total) {
                jobPostingsState.total = action.payload.total;
            }
            return {
                ...state,
                jobPostings: jobPostingsState
            };
        }
        case PersonnelActionTypes.AddJobApplications:
        {
            let newState = { ...state };
            newState.jobApplications = jobApplicationsAdapter.upsertMany(action.payload.jobApplications, state.jobApplications);
            if (action.payload.total) {
                newState.jobApplications.total = action.payload.total;
            }
            return newState;
        }
        default: {
            return state;
        }
    }
}

export const jobTitleEntitySelectors = jobTitlesAdapter.getSelectors((state: State) => state.jobTitles);
export const jobPostingEntitySelectors = jobPostingsAdapter.getSelectors((state: State) => state.jobPostings);
export const jobApplicationEntitySelectors = jobApplicationsAdapter.getSelectors((state: State) => state.jobApplications);

export const selectJobTitleByName = (name: string) => (state: State) => jobTitleEntitySelectors.selectAll(state).filter(title => title.name == name)[0];
export const selectTotalJobTitles = (state: State) => state.jobTitles.total;

export const selectJobPostingById = (id: string) => (state: State) => jobPostingEntitySelectors.selectAll(state).filter(posting => posting.id == id)[0];
export const selectTotalJobPostings = (state: State) => state.jobPostings.total;

export const selectJobApplicationById = (id: string) => (state: State) => jobApplicationEntitySelectors.selectAll(state).filter(application => application.id == id)[0];
export const selectTotalJobApplications = (state: State) => state.jobApplications.total;