import { schema } from 'normalizr';
import { jobTitleSchema } from './JobTitle';

export const jobPostingSchema = new schema.Entity('jobPostings', {
    jobTitle: jobTitleSchema
});

export const jobPostingListSchema = new schema.Array(jobPostingSchema);

export interface JobPosting {
    id: string,
    jobTitle: string,
    description: string,
    postedTime: Date
}