import { schema } from 'normalizr';
import { jobPostingSchema } from './JobPosting';
import { JobApplicationDecision } from './JobApplicationDecision';

export const jobApplicationSchema = new schema.Entity('jobApplications', {
    jobPosting: jobPostingSchema
});

export const jobApplicationListSchema = new schema.Array(jobApplicationSchema);

export interface JobApplication {
    id: string;
    jobPosting: string;
    time: Date;
    applicantId: string;
    decision?: JobApplicationDecision;
}