using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Personnel.Api.Dtos;

namespace Personnel.Api.Application.Commands
{
    public class CreateJobPostingCommand : IRequest<JobPostingDto>
    {
        [Required]
        public string JobTitle { get; set; }

        [Required]
        public string Description { get; set; }
    }
}
