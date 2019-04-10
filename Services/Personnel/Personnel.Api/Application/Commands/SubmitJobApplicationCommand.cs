using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Personnel.Api.Dtos;

namespace Personnel.Api.Application.Commands
{
    public class SubmitJobApplicationCommand : IRequest<JobApplicationDto>
    {
        [Required]
        public int JobPostingId { get; set; }

        [Required]
        public IFormFile Resume { get; set; }
    }
}
