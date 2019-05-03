using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Personnel.Api.Dtos;

namespace Personnel.Api.Application.Commands
{
    public class HirePersonCommand : INotification
    {
        [Required]
        public int PersonId { get; }
        [Required]
        public JobTitleDto JobTitle { get; }

        public HirePersonCommand(int personId, JobTitleDto jobTitle)
        {
            PersonId = personId;
            JobTitle = jobTitle;
        }
    }
}
