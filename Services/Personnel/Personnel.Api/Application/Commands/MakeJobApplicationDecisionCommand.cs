using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Personnel.Api.Dtos;

namespace Personnel.Api.Application.Commands
{
    public class MakeJobApplicationDecisionCommand : IRequest<JobApplicationDto>
    {
        [Required]
        public int ApplicationId { get; set; }

        [Required, RegularExpression("\b(Hire)|(Reject)\b")]
        public string Decision { get; set; }
    }
}
