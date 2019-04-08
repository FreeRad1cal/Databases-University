using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
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
            var jobPostings = await _employmentQueries.GetJobPostings(pagination, query, jobTitles);
            return Ok(jobPostings);
        }

        [HttpGet("job-postings/{id}", Name = nameof(GetJobPostingById))]
        public async Task<ActionResult> GetJobPostingById([Required, FromRoute] int id)
        {
            throw new NotImplementedException();
        }

        [HttpPost("job-postings", Name = nameof(CreateJobPosting))]
        public async Task<ActionResult> CreateJobPosting([FromBody] CreateJobPostingCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var jobPosting = await _mediator.Send(command);
            return Created(Url.Action(nameof(GetJobPostingById), jobPosting.Id), jobPosting);
        }

        [HttpGet("job-titles", Name = nameof(GetJobTitles))]
        public async Task<ActionResult> GetJobTitles()
        {
            var jobTitles = await _employmentQueries.GetJobTitles();
            return Ok(jobTitles);
        }
    }
}