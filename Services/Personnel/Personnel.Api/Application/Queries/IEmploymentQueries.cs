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
        Task<ArrayResponse<JobPostingDto>> GetJobPostingsAsync(Pagination pagination, string query = null,
            IEnumerable<string> jobTitleNames = null);

        Task<JobPostingDto> GetJobPostingByIdAsync(int id);

        Task<ArrayResponse<JobApplicationDto>> GetJobApplicationsByApplicantIdAsync(int applicantId);

        Task<ArrayResponse<JobApplicationDto>> GetJobApplications(Pagination pagination, int? applicantId, int? jobPostingId);

        Task<ArrayResponse<JobTitleDto>> GetJobTitlesAsync();

        Task<JobTitleDto> GetJobTitleByNameAsync(string name);

        Task<byte[]> GetResumeByApplicationId(int id);
    }
}
