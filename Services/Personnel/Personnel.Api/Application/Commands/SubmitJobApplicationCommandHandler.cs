using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Personnel.Api.Application.Queries;
using Personnel.Api.Dtos;
using Personnel.Api.Infrastructure.Services;
using Personnel.Domain.AggregateModel.JobApplicationAggregate;
using Personnel.Domain.Exceptions;

namespace Personnel.Api.Application.Commands
{
    public class SubmitJobApplicationCommandHandler : IRequestHandler<SubmitJobApplicationCommand, JobApplicationDto>
    {
        private readonly IJobApplicationRepository _jobApplicationRepository;
        private readonly IMapper _mapper;
        private readonly IEmploymentQueries _employmentQueries;
        private readonly IPersonQueries _personQueries;
        private readonly ILogger<SubmitJobApplicationCommandHandler> _logger;
        private readonly IIdentityService _identityService;

        public SubmitJobApplicationCommandHandler(
            IJobApplicationRepository jobApplicationRepository,
            IMapper mapper,
            IEmploymentQueries employmentQueries,
            IPersonQueries personQueries,
            ILogger<SubmitJobApplicationCommandHandler> logger,
            IIdentityService identityService)
        {
            _jobApplicationRepository = jobApplicationRepository;
            _mapper = mapper;
            _employmentQueries = employmentQueries;
            _personQueries = personQueries;
            _logger = logger;
            _identityService = identityService;
        }

        public async Task<JobApplicationDto> Handle(SubmitJobApplicationCommand request, CancellationToken cancellationToken)
        {
            if (await _employmentQueries.GetJobPostingByIdAsync(request.JobPostingId) == null)
            {
                throw new PersonnelDomainException(ErrorTypes.JobApplicationError,new[] {"Invalid job posting id"});
            }

            var myId = _identityService.GetUserIdentity();

            var hasApplied = (await _employmentQueries.GetJobApplicationsByApplicantIdAsync(myId))
                .Items
                .Any(app => app.JobPosting.Id == request.JobPostingId);
            if (hasApplied)
            {
                throw new PersonnelDomainException(ErrorTypes.JobApplicationError, new[] { "You have already applied for this position" });
            }

            var memoryStream = new MemoryStream();
            await request.Resume.CopyToAsync(memoryStream, cancellationToken);
;
            var jobApplication = new JobApplication(request.JobPostingId, myId);
            var result = _jobApplicationRepository.Add(jobApplication, memoryStream.ToArray());
            await _jobApplicationRepository.UnitOfWork.SaveChangesAsync();

            var jobApplicationDto = await _employmentQueries.GetJobApplicationByIdAsync(result.Id);
            return jobApplicationDto;
        }
    }
}
