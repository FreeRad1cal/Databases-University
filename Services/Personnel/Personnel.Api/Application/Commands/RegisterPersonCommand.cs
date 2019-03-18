﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Personnel.Api.Dtos;
using Personnel.Api.Entities;

namespace Personnel.Api.Application.Commands
{
    public class RegisterPersonCommand : IRequest<PersonDto>
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        [EmailAddress]
        public string EmailAddress { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public AddressDto HomeAddress { get; set; }

        public AddressDto MailingAddress { get; set; }
    }
}