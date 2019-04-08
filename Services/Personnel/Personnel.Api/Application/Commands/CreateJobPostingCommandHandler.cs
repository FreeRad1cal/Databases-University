using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Personnel.Api.Dtos;
using Personnel.Domain.AggregateModel.JobPostingAggregate;
using SecureChat.Common.Events.EventBus.Abstractions;

namespace Personnel.Api.Application.Commands
{
    public class CreateJobPostingCommandHandler : IRequestHandler<CreateJobPostingCommand, JobPostingDto>
    {
        private readonly IJobPostingRepository _jobPostingRepository;
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly ILogger<CreateJobPostingCommandHandler> _logger;

        public CreateJobPostingCommandHandler(
            IJobPostingRepository jobPostingRepository,
            IMediator mediator,
            IMapper mapper,
            ILogger<CreateJobPostingCommandHandler> logger)
        {
            _jobPostingRepository = jobPostingRepository;
            _mediator = mediator;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<JobPostingDto> Handle(CreateJobPostingCommand request, CancellationToken cancellationToken)
        {
            var jobPosting = new JobPosting(new JobTitle(request.JobTitle), request.Description);

            _logger.LogInformation("----- Creating Job Posting - JobPosting: {@JobPosting}", jobPosting);

            var result = _jobPostingRepository.Add(jobPosting);
            await _jobPostingRepository.SaveChangesAsync();
            
            return _mapper.Map<JobPostingDto>(result);
        }
    }
}
