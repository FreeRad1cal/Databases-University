using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Personnel.Api.Dtos
{
    public class JobPostingDto
    {
        public int Id { get; set; }

        public string JobTitleName { get; set; }

        public string Description { get; set; }

        public DateTime PostedTime { get; set; }
    }
}
