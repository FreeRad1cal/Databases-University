import { schema } from 'normalizr';
import { jobPostingSchema } from './JobPosting';

export const jobApplicationSchema = new schema.Entity('jobApplications', {
    jobPosting: jobPostingSchema
});

export const jobApplicationListSchema = new schema.Array(jobApplicationSchema);

export interface JobApplication {
    id: string;
    jobPosting: string;
    time: Date;
    applicantId: string;
}