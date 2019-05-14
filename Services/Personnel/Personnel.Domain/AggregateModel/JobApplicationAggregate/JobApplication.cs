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
        public string ResumeFileName { get; private set; }

        public int JobPostingId { get; private set; }

        public int ApplicantId { get; private set; }

        public DateTime Time { get; private set; }

        public JobApplicationDecision Decision { get; private set; }

        private JobApplication() { }

        public JobApplication(int jobPostingId, int applicantId, string resumeFileName = null)
        {
            JobPostingId = jobPostingId;
            ApplicantId = applicantId;
            Time = DateTime.Now;
            ResumeFileName = resumeFileName;
        }

        public void MakeDecision(string decision, int deciderId)
        {
            if (Decision != null)
            {
                throw new PersonnelDomainException("Invalid operation", new[] {"Job application decision already made"});
            }

            Decision = new JobApplicationDecision(decision, deciderId);

            AddDomainEvent(new JobApplicationDecisionMadeDomainEvent(this));
        }
    }
}
