using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Personnel.Domain.AggregateModel.JobPostingAggregate;

namespace Personnel.Api.Dtos
{
    public class JobApplicationDto
    {
        public int Id { get; set; }

        public JobPostingDto JobPosting { get; set; }

        public PersonDto Person { get; set; }

        public DateTime Time { get; set; }
    }
}
