using System;
using System.Collections.Generic;
using System.Text;
using Personnel.Domain.Common;

namespace Personnel.Domain.AggregateModel.JobPostingAggregate
{
    public class JobTitle : ValueObject
    {
        public string Name { get; }

        public JobTitle(string name)
        {
            Name = name;
        }

        protected override IEnumerable<object> GetAtomicValues()
        {
            yield return Name;
        }
    }
}
