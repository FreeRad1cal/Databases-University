using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Personnel.Domain.Common;

namespace Personnel.Domain.AggregateModel.JobApplicationAggregate
{
    public interface IJobApplicationRepository : IRepository<JobApplication>
    {
        JobApplication Add(JobApplication jobApplication);

        void Update(JobApplication jobPosting);

        Task<JobApplication> GetAsync(int jobApplicationId);
    }
}
