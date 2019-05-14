using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Personnel.Api.Dtos
{
    public class JobApplicationDecisionDto
    {
        public string Decision { get; set; }

        public DateTime Time { get; set; }
    }
}
