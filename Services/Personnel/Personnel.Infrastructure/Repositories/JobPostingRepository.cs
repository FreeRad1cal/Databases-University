using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using MediatR;
using Personnel.Domain.AggregateModel.JobPostingAggregate;
using Personnel.Domain.Common;
using Personnel.Infrastructure.UnitOfWork;

namespace Personnel.Infrastructure.Repositories
{
    public class JobPostingRepository : IJobPostingRepository
    {
        public IUnitOfWork UnitOfWork { get; }

        public JobPostingRepository(IUnitOfWork unitOfWork)
        {
            UnitOfWork = unitOfWork;
        }

        public JobPosting Add(JobPosting jobPosting)
        {
            var jobTitleSql = $@"INSERT IGNORE INTO JobTitles (Name)
                                VALUES (@{nameof(JobTitle.Name)})";
            UnitOfWork.AddOperation(jobPosting.JobTitle, async connection =>
            {
                await connection.ExecuteAsync(jobTitleSql, jobPosting.JobTitle);
            });

            var jobPostingSql = $@"INSERT INTO JobPostings (JobTitleName, Description, PostedTime)
                        VALUES (@JobTitleName, @{nameof(JobPosting.Description)}, @{nameof(JobPosting.PostedTime)});
                        SELECT LAST_INSERT_ID();";
            UnitOfWork.AddOperation(jobPosting, async connection =>
            {
                var id = await connection.QueryFirstAsync<int>(jobPostingSql, new
                {
                    JobTitleName = jobPosting.JobTitle.Name,
                    jobPosting.PostedTime,
                    jobPosting.Description
                });
                jobPosting.Id = id;
            });

            return jobPosting;
        }

        public void Update(JobPosting jobPosting)
        {
            throw new NotImplementedException();
        }

        public async Task<JobPosting> GetAsync(int personId)
        {
            throw new NotImplementedException();
        }
    }
}
