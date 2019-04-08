using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Personnel.Domain.Common;

namespace Personnel.Domain.AggregateModel.JobPostingAggregate
{
    public interface IJobPostingRepository : IRepository<JobPosting>
    {
        JobPosting Add(JobPosting jobPosting);

        void Update(JobPosting jobPosting);

        Task<JobPosting> GetAsync(int personId);
    }
}
