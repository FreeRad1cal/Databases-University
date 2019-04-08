using System;
using System.Collections.Generic;
using System.Text;
using Personnel.Domain.Common;
using Personnel.Domain.Events;

namespace Personnel.Domain.AggregateModel.JobPostingAggregate
{
    public class JobPosting: Entity, IAggregateRoot
    {
        public JobTitle JobTitle { get; }
        public string Description { get; }
        public DateTime PostedTime { get; } = DateTime.Now;

        public JobPosting(JobTitle jobTitle, string description)
        {
            JobTitle = jobTitle;
            Description = description;

            AddDomainEvent(new JobPostingCreatedDomainEvent(this));
        }
    }
}
