using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Personnel.Api.Entities
{
    public class Person
    {
        public int Id { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public Address Address { get; set; }
    }
}
