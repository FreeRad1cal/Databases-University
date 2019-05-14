using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Personnel.Api.Application.Queries;
using Personnel.Domain.AggregateModel.JobPostingAggregate;
using Personnel.Domain.AggregateModel.PersonAggregate;
using Personnel.Domain.Exceptions;

namespace Personnel.Api.Application.Commands
{
    public class HirePersonCommandHandler : INotificationHandler<HirePersonCommand>
    {
        private readonly IPersonRepository _personRepository;
        private readonly IPersonQueries _personQueries;
        private readonly ILogger<HirePersonCommandHandler> _logger;
        private readonly IMapper _mapper;
        private readonly IEmploymentQueries _employmentQueries;

        public HirePersonCommandHandler(
            IPersonRepository personRepository,
            IPersonQueries personQueries,
            ILogger<HirePersonCommandHandler> logger,
            IMapper mapper,
            IEmploymentQueries employmentQueries)
        {
            _personRepository = personRepository;
            _personQueries = personQueries;
            _logger = logger;
            _mapper = mapper;
            _employmentQueries = employmentQueries;
        }

        public async Task Handle(HirePersonCommand request, CancellationToken cancellationToken)
        {
            if (await _employmentQueries.GetJobTitleByNameAsync(request.JobTitle.Name) == null)
            {
                throw new PersonnelDomainException("Error in the hiring process",
                    new[] {$"Title {request.JobTitle.Name} does not exist"});
            }

            var person = await _personRepository.GetAsync(request.PersonId);

            _logger.LogInformation($"Hiring person {request.PersonId} to job title {request.JobTitle.Name}");

            person.Hire(_mapper.Map<JobTitle>(request.JobTitle));
            _personRepository.Update(person);
            await _personRepository.UnitOfWork.SaveChangesAsync();

            _logger.LogInformation($"Hired person {request.PersonId} to job title {request.JobTitle.Name}");
        }
    }
}
