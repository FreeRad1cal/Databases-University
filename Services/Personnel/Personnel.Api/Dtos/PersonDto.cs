using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Personnel.Api.Dtos
{
    public class PersonDto
    {
        public int Id { get; set; }

        public string UserName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public AddressDto HomeAddress { get; set; }

        public AddressDto MailingAddress { get; set; }
    }
}
