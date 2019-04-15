using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Personnel.Domain.AggregateModel.JobPostingAggregate;

namespace Personnel.Api.Dtos
{
    public class JobPostingDto
    {
        public int Id { get; set; }

        public JobTitleDto JobTitle { get; set; }

        public string Description { get; set; }

        public DateTime PostedTime { get; set; }
    }
}
