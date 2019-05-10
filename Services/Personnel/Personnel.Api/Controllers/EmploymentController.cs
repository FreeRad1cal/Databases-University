using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Personnel.Api.Application.Commands;
using Personnel.Api.Application.Queries;
using Personnel.Api.Dtos;
using Personnel.Api.Models;

namespace Personnel.Api.Controllers
{
    [Route("employment")]
    [Authorize]
    public class EmploymentController : Controller
    {
        private readonly IMediator _mediator;
        private readonly IEmploymentQueries _employmentQueries;

        public EmploymentController(IMediator mediator, IEmploymentQueries employmentQueries)
        {
            _mediator = mediator;
            _employmentQueries = employmentQueries;
        }

        [HttpGet("job-postings", Name = nameof(GetJobPostings))]
        public async Task<ActionResult> GetJobPostings(string query, Pagination pagination, IEnumerable<string> jobTitles)
        {
            var jobPostings = await _employmentQueries.GetJobPostingsAsync(pagination, query, jobTitles);
            return Ok(jobPostings);
        }

        [HttpGet("job-postings/{id}", Name = nameof(GetJobPostingById))]
        public async Task<ActionResult> GetJobPostingById([FromRoute] int id)
        {
            var jobPosting = await _employmentQueries.GetJobPostingByIdAsync(id);
            if (jobPosting == null)
            {
                return NotFound(new ErrorResponse(new [] {"Job posting not found"}));
            }

            return Ok(jobPosting);
        }

        [HttpPost("job-postings", Name = nameof(CreateJobPosting))]
        public async Task<ActionResult> CreateJobPosting([FromBody] CreateJobPostingCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ErrorResponse(ModelState));
            }

            var jobPosting = await _mediator.Send(command);
            return Created(Url.Link(nameof(GetJobPostingById), new {jobPosting.Id}), jobPosting);
        }

        [HttpGet("job-titles", Name = nameof(GetJobTitles))]
        public async Task<ActionResult> GetJobTitles()
        {
            var jobTitles = await _employmentQueries.GetJobTitlesAsync();
            return Ok(jobTitles);
        }

        [HttpPost("job-applications", Name = nameof(SubmitJobApplication))]
        public async Task<ActionResult> SubmitJobApplication([FromForm] SubmitJobApplicationCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ErrorResponse(ModelState));
            }

            var jobApplication = await _mediator.Send(command);
            return Created(Url.Link(nameof(GetJobApplicationById), new {Id = jobApplication.Id}), jobApplication);
        }

        [HttpGet("job-applications", Name = nameof(GetJobApplications))]
        public async Task<ActionResult> GetJobApplications(int? applicantId, int? jobPostingId)
        {
            var jobApplications = await _employmentQueries.GetJobApplications(applicantId, jobPostingId);
            return Ok(jobApplications);
        }

        [HttpGet("job-applications/{id}", Name = nameof(GetJobApplicationById))]
        public async Task<ActionResult> GetJobApplicationById([FromRoute] int id)
        {
            throw new NotImplementedException();
        }

        [HttpGet("resumes/{id}")]
        public async Task<ActionResult> GetResumeByApplicationid([FromRoute] int id)
        {
            var resume = await _employmentQueries.GetResumeByApplicationId(id);
            return File(resume, "application/pdf");
        }

        [HttpDelete("job-applications/{id}")]
        public async Task<ActionResult> DeleteJobApplicationById([FromRoute] int id)
        {
            await _mediator.Publish(new DeleteJobApplicationCommand(id));
            return NoContent();
        }

        public async Task<ActionResult> HirePerson([FromBody] HirePersonCommand command)
        {

        }
    }
}