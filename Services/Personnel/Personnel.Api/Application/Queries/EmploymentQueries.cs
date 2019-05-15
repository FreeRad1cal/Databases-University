using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using Personnel.Api.Dtos;
using Personnel.Api.Models;
using Personnel.Domain.AggregateModel.JobPostingAggregate;
using Personnel.Infrastructure;
using Personnel.Infrastructure.Services;

namespace Personnel.Api.Application.Queries
{
    public class EmploymentQueries : IEmploymentQueries
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;
        private readonly IMapper _mapper;
        private readonly IResumePersisterService _resumePersisterService;

        public EmploymentQueries(IDbConnectionFactory dbConnectionFactory, IMapper mapper, IResumePersisterService resumePersisterService)
        {
            _dbConnectionFactory = dbConnectionFactory;
            _mapper = mapper;
            _resumePersisterService = resumePersisterService;
        }

        public async Task<ArrayResponse<JobPostingDto>> GetJobPostingsAsync(Pagination pagination, string query = null, IEnumerable<string> jobTitleNames = null)
        {
            var descriptionFilter = string.IsNullOrWhiteSpace(query)
                ? @"TRUE"
                : @"JobPostings.Description LIKE @Query";

            var jobTitleFilter = jobTitleNames == null || !jobTitleNames.Any()
                ? @"TRUE"
                : @"JobPostings.JobTitleName IN @JobTitleNames";

            var sql = $@"SELECT * FROM JobPostings
                        JOIN JobTitles ON JobTitles.Name = JobPostings.JobTitleName
                        WHERE {descriptionFilter} AND {jobTitleFilter}
                        LIMIT @Limit OFFSET @Offset";

            using (var conn = await _dbConnectionFactory.GetConnectionAsync())
            {
                var result = await conn.QueryAsync<JobPostingDto, JobTitleDto, JobPostingDto>(sql,
                    (posting, jobTitle) =>
                    {
                        posting.JobTitle = jobTitle;
                        return posting;
                    },
                    new
                    {
                        Limit = pagination.Limit,
                        Offset = pagination.Offset,
                        JobTitleNames = jobTitleNames,
                        Query = $"%{query}%"
                    },
                splitOn: "Name");

                var total = await conn.QueryFirstOrDefaultAsync<int>(@"SELECT COUNT(*) AS total FROM JobPostings");

                return new ArrayResponse<JobPostingDto>()
                {
                    Total = total,
                    Items = result
                };
            }
        }

        public async Task<JobPostingDto> GetJobPostingByIdAsync(int id)
        {
            var sql = $@"SELECT * FROM JobPostings
                        JOIN JobTitles ON JobPostings.JobTitleName = JobTitles.Name
                        WHERE JobPostings.Id = @{nameof(id)}";

            using (var conn = await _dbConnectionFactory.GetConnectionAsync())
            {
                var result = await conn.QueryAsync<JobPostingDto, JobTitleDto, JobPostingDto>(sql, (posting, jobTitle) =>
                {
                    posting.JobTitle = jobTitle;
                    return posting;
                },
                new { id },
                splitOn: "Name");

                return result.FirstOrDefault();
            }
        }

        public async Task<ArrayResponse<JobApplicationDto>> GetJobApplicationsByApplicantIdAsync(int applicantId)
        {
            return await GetJobApplications(Pagination.Default, applicantId, null);
        }

        public async Task<ArrayResponse<JobApplicationDto>> GetJobApplications(Pagination pagination, int? applicantId, int? jobPostingId)
        {
            var applicantFilter = applicantId is null
                ? @"TRUE"
                : $@"JobApplications.ApplicantId = @{nameof(applicantId)}";

            var jobTitleFilter = jobPostingId is null
                ? @"TRUE"
                : $@"JobApplications.JobPostingId = @{nameof(jobPostingId)}";

            var sql = $@"SELECT * FROM JobApplications
                        JOIN JobPostings ON JobApplications.JobPostingId = JobPostings.Id
                        JOIN JobTitles ON JobPostings.JobTitleName = JobTitles.Name
                        LEFT JOIN JobApplicationDecisions ON JobApplicationDecisions.JobApplicationId = JobApplications.Id
                        WHERE {applicantFilter} AND {jobTitleFilter}
                        LIMIT @Limit OFFSET @Offset";

            using (var conn = await _dbConnectionFactory.GetConnectionAsync())
            {
                var result = await conn.QueryAsync(sql,
                    (JobApplicationDto jobApplication, JobPostingDto jobPosting, JobTitleDto jobTitle, JobApplicationDecisionDto decision) =>
                    {
                        jobPosting.JobTitle = jobTitle;
                        jobApplication.JobPosting = jobPosting;
                        if (decision.Decision != null)
                        {
                            jobApplication.Decision = decision;
                        }
                        return jobApplication;
                    },
                    new { applicantId, jobPostingId, pagination.Limit, pagination.Offset },
                    splitOn: "Id,Id,Name,JobApplicationId");
                var total = await conn.QueryFirstOrDefaultAsync<int>(@"SELECT COUNT(*) AS total FROM JobApplications");

                return new ArrayResponse<JobApplicationDto>()
                {
                    Total = total,
                    Items = result
                };
            }
        }

        public async Task<ArrayResponse<JobTitleDto>> GetJobTitlesAsync()
        {
            var sql = $@"SELECT * FROM JobTitles";

            using (var conn = await _dbConnectionFactory.GetConnectionAsync())
            {
                var result = await conn.QueryAsync<JobTitleDto>(sql);
                var total = await conn.QueryFirstOrDefaultAsync<int>(@"SELECT COUNT(*) AS total FROM JobTitles");

                return new ArrayResponse<JobTitleDto>()
                {
                    Total = total,
                    Items = result
                };
            }
        }

        public async Task<JobTitleDto> GetJobTitleByNameAsync(string name)
        {
            var sql = $@"SELECT * FROM JobTitles WHERE JobTitles.Name = @{nameof(name)}";

            using (var conn = await _dbConnectionFactory.GetConnectionAsync())
            {
                return await conn.QueryFirstOrDefaultAsync<JobTitleDto>(sql, new {name});
            }
        }

        public async Task<JobApplicationDto> GetJobApplicationByIdAsync(int id)
        {

            var sql = $@"SELECT * FROM JobApplications
                        JOIN JobPostings ON JobApplications.JobPostingId = JobPostings.Id
                        JOIN JobTitles ON JobPostings.JobTitleName = JobTitles.Name
                        LEFT JOIN JobApplicationDecisions ON JobApplicationDecisions.JobApplicationId = JobApplications.Id
                        WHERE JobApplications.Id = @{nameof(id)}";

            using (var conn = await _dbConnectionFactory.GetConnectionAsync())
            {
                var resultSet = await conn.QueryAsync(sql,
                    (JobApplicationDto jobApplication, JobPostingDto jobPosting, JobTitleDto jobTitle, JobApplicationDecisionDto decision) =>
                    {
                        jobPosting.JobTitle = jobTitle;
                        jobApplication.JobPosting = jobPosting;
                        if (decision.Decision != null)
                        {
                            jobApplication.Decision = decision;
                        }
                        
                        return jobApplication;
                    },
                    new { id },
                    splitOn: "Id,Id,Name,JobApplicationId");

                return resultSet.FirstOrDefault();
            }
        }

        public async Task<byte[]> GetResumeByJobApplicationIdAsync(int id)
        {
            var sql = $@"SELECT ResumeFileName
                        FROM JobApplications
                        WHERE JobApplications.Id = @{nameof(id)}";

            string fileName;
            using (var conn = await _dbConnectionFactory.GetConnectionAsync())
            {
                fileName = await conn.QueryFirstOrDefaultAsync<string>(sql, new { id });
            }

            return await _resumePersisterService.GetResumeAsync(fileName);
        }
    }
}
