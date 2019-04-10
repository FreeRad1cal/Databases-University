using System;
using System.Collections.Generic;
using System.Text;
using Personnel.Domain.AggregateModel.JobPostingAggregate;
using Personnel.Domain.AggregateModel.PersonAggregate;
using Personnel.Domain.Common;
using Personnel.Domain.Events;
using Personnel.Domain.Exceptions;

namespace Personnel.Domain.AggregateModel.JobApplicationAggregate
{
    public class JobApplication : Entity, IAggregateRoot
    {
        public byte[] Resume { get; }

        public int JobPostingId { get; }

        public int ApplicantId { get; }

        public DateTime Time { get; } = DateTime.Now;

        public JobApplication(int jobPostingId, int applicantId, byte[] resume)
        {
            JobPostingId = jobPostingId;
            ApplicantId = applicantId;
            Resume = resume;

            if (resume.Length > 16777215)
            {
                throw new PersonnelDomainException("Could not create job application",
                    new[] {"The resume file is too large"});
            }

            AddDomainEvent(new JobApplicationSubmittedDomainEvent(this));
        }
    }
}
