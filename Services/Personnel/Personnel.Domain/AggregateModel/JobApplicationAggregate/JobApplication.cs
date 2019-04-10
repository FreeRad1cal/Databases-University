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
        public byte[] Resume { get; private set; }

        public string ResumeFileName { get; private set; }

        public int JobPostingId { get; private set; }

        public int ApplicantId { get; private set; }

        public DateTime Time { get; private set; }

        public static JobApplication Create(int jobPostingId, int applicantId, byte[] resume)
        {
            if (resume.Length > 16777215)
            {
                throw new PersonnelDomainException("Could not create job application",
                    new[] { "The resume file is too large" });
            }

            var jobApplication = new JobApplication(jobPostingId, applicantId, DateTime.Now, resume);
            jobApplication.AddDomainEvent(new JobApplicationSubmittedDomainEvent(jobApplication));
            return jobApplication;
        }

        public JobApplication(int jobPostingId, int applicantId, DateTime time, byte[] resume = null, string resumeFileName = null)
        {
            JobPostingId = jobPostingId;
            ApplicantId = applicantId;
            Time = time;
            Resume = resume;
            ResumeFileName = resumeFileName;
        }
    }
}
