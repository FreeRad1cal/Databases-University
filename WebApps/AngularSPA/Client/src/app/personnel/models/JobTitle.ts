import { schema } from 'normalizr';

export const jobTitleSchema = new schema.Entity('jobTitles', {}, {
    idAttribute: 'name'
  });

export const jobTitleListSchema = new schema.Array(jobTitleSchema);

export interface JobTitle {
    name: string;
}