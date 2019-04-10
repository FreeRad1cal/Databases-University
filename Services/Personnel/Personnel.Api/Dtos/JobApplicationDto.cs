using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Personnel.Api.Dtos
{
    public class JobApplicationDto
    {
        public int Id { get; set; }

        public int JobPostingId { get; set; }

        public int ApplicantId { get; set; }

        public DateTime Time { get; set; }
    }
}
