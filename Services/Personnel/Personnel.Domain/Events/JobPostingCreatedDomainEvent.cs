using System;
using System.Collections.Generic;
using System.Text;
using MediatR;
using Personnel.Domain.AggregateModel.JobPostingAggregate;

namespace Personnel.Domain.Events
{
    public class JobPostingCreatedDomainEvent : INotification
    {
        public JobPosting JobPosting { get; }

        public JobPostingCreatedDomainEvent(JobPosting jobPosting)
        {
            JobPosting = jobPosting;
        }
    }
}
