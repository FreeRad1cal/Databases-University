using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using Personnel.Api.Application.Queries;
using Personnel.Api.Dtos;
using Personnel.Api.Infrastructure.Services;
using Personnel.Domain.AggregateModel.JobApplicationAggregate;
using Personnel.Domain.AggregateModel.JobPostingAggregate;
using Personnel.Domain.AggregateModel.PersonAggregate;
using Personnel.Domain.Exceptions;
using Personnel.Infrastructure.Repositories;

namespace Personnel.Api.Application.Commands
{
    public class MakeJobApplicationDecisionCommandHandler : IRequestHandler<MakeJobApplicationDecisionCommand, JobApplicationDto>
    {
        private readonly IJobApplicationRepository _jobApplicationRepository;
        private readonly ILogger<MakeJobApplicationDecisionCommandHandler> _logger;
        private readonly IEmploymentQueries _employmentQueries;
        private readonly IIdentityService _identityService;

        public MakeJobApplicationDecisionCommandHandler(
            IJobApplicationRepository jobApplicationRepository,
            ILogger<MakeJobApplicationDecisionCommandHandler> logger,
            IEmploymentQueries employmentQueries,
            IIdentityService identityService)
        {
            _jobApplicationRepository = jobApplicationRepository;
            _logger = logger;
            _employmentQueries = employmentQueries;
            _identityService = identityService;
        }

        public async Task<JobApplicationDto> Handle(MakeJobApplicationDecisionCommand request, CancellationToken cancellationToken)
        {
            var jobApplication = await _jobApplicationRepository.GetAsync(request.ApplicationId)
                ?? throw new PersonnelDomainException("Could not submit job application decision", new[] { $"Job application with id {request.ApplicationId} does not exist" });

            var myId = _identityService.GetUserIdentity();

            jobApplication.MakeDecision(request.Decision, myId);
            _jobApplicationRepository.Update(jobApplication);

            _logger.LogInformation("----- Saving job application decision - Id: {@Id}, Decision: {@Decision}", request.ApplicationId, request.Decision);

            await _jobApplicationRepository.UnitOfWork.SaveChangesAsync();

            _logger.LogInformation("----- Saved job application decision - Id: {@Id}, Decision: {@Decision}", request.ApplicationId, request.Decision);

            return await _employmentQueries.GetJobApplicationByIdAsync(jobApplication.Id);
        }
    }
}
