using System;
using System.Collections.Generic;
using System.Text;
using Personnel.Domain.Common;

namespace Personnel.Domain.AggregateModel.JobApplicationAggregate
{
    public class JobApplicationDecision : Entity
    {
        public static readonly string Hire = "Hire";
        public static readonly string Reject = "Reject";
        public string Decision { get; private set; }

        public int DeciderId { get; private set; }

        public DateTime DecisionDate { get; private set; }

        public JobApplicationDecision(string decision, int deciderId)
        {
            Decision = decision;
            DeciderId = deciderId;
            DecisionDate = DateTime.Now;
        }
    }
}
