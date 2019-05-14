using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Personnel.Api.Application.Commands;
using Personnel.Api.Application.Queries;
using Personnel.Domain.AggregateModel.JobApplicationAggregate;
using Personnel.Domain.Events;

namespace Personnel.Api.Application.DomainEventHandlers.JobApplicationDecisionMade
{
    public class HirePersonDomainEventHandler: INotificationHandler<JobApplicationDecisionMadeDomainEvent>
    {
        private readonly IMediator _mediator;
        private readonly IEmploymentQueries _employmentQueries;

        public HirePersonDomainEventHandler(
            IMediator mediator,
            IEmploymentQueries employmentQueries)
        {
            _mediator = mediator;
            _employmentQueries = employmentQueries;
        }
        public async Task Handle(JobApplicationDecisionMadeDomainEvent notification, CancellationToken cancellationToken)
        {
            if (notification.JobApplication.Decision.Decision == JobApplicationDecision.Hire)
            {
                var jobPosting = await _employmentQueries.GetJobPostingByIdAsync(notification.JobApplication.JobPostingId);
                await _mediator.Publish(new HirePersonCommand(notification.JobApplication.ApplicantId, jobPosting.JobTitle));
            }
        }
    }
}
