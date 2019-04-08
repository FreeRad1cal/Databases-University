using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Personnel.Api.Dtos;
using Personnel.Api.Models;

namespace Personnel.Api.Application.Queries
{
    public interface IEmploymentQueries
    {
        Task<ArrayResponse<JobPostingDto>> GetJobPostings(Pagination pagination, string query = null,
            IEnumerable<string> jobTitleNames = null);

        Task<JobPostingDto> GetJobPostinById(int id);

        Task<IEnumerable<JobTitleDto>> GetJobTitles();
    }
}
