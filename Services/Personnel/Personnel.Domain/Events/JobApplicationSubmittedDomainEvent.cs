using System;
using System.Collections.Generic;
using System.Text;
using MediatR;
using Personnel.Domain.AggregateModel.JobApplicationAggregate;

namespace Personnel.Domain.Events
{
    public class JobApplicationSubmittedDomainEvent : INotification
    {
        public JobApplication JobApplication { get; }

        public JobApplicationSubmittedDomainEvent(JobApplication jobApplication)
        {
            JobApplication = jobApplication;
        }
    }
}
