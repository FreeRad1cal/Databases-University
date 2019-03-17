using System;
using System.Collections.Generic;
using System.Text;
using Personnel.Domain.Common;

namespace Personnel.Domain.PersonAggregate
{
    public class Person : Entity, IAggregateRoot
    {
        public string UserName { get; set; }

        public string Email { get; set; }

        public Address HomeAddress { get; set; }

        private Address _mailingAddress;
        public Address MailingAddress
        {
            get => _mailingAddress ?? HomeAddress;
            set => _mailingAddress = value;
        }
    }
}
