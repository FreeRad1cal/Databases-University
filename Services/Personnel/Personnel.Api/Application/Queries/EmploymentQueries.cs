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

namespace Personnel.Api.Application.Queries
{
    public class EmploymentQueries : IEmploymentQueries
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;
        private readonly IMapper _mapper;

        public EmploymentQueries(IDbConnectionFactory dbConnectionFactory, IMapper mapper)
        {
            _dbConnectionFactory = dbConnectionFactory;
            _mapper = mapper;
        }

        public async Task<ArrayResponse<JobPostingDto>> GetJobPostings(Pagination pagination, string query = null, IEnumerable<string> jobTitleNames = null)
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
                    (posting, jobTitle) => posting,
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

        public async Task<JobPostingDto> GetJobPostinById(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<JobTitleDto>> GetJobTitles()
        {
            var sql = $@"SELECT * FROM JobTitles";

            using (var conn = await _dbConnectionFactory.GetConnectionAsync())
            {
                return await conn.QueryAsync<JobTitleDto>(sql);
            }
        }
    }
}
