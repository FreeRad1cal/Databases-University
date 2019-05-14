using System;
using System.Collections.Generic;
using System.Text;
using MediatR;
using Personnel.Domain.AggregateModel.JobApplicationAggregate;

namespace Personnel.Domain.Events
{
    public class JobApplicationDecisionMadeDomainEvent : INotification
    {
        public JobApplication JobApplication { get; }

        public JobApplicationDecisionMadeDomainEvent(JobApplication jobApplication)
        {
            JobApplication = jobApplication;
        }
    }
}
