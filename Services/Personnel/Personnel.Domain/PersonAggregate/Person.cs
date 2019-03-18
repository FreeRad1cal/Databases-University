using System;
using System.Collections.Generic;
using System.Text;
using Personnel.Domain.Common;

namespace Personnel.Domain.PersonAggregate
{
    public class Person : Entity, IAggregateRoot
    {
        public Person(string userName, string email, Address homeAddress, Address mailingAddress = null)
        {
            _mailingAddress = mailingAddress;
            UserName = userName;
            Email = email;
            HomeAddress = homeAddress;
        }

        public string UserName { get;  }

        public string Email { get; }

        public Address HomeAddress { get; }

        private Address _mailingAddress;
        public Address MailingAddress
        {
            get => _mailingAddress ?? HomeAddress;
            set => _mailingAddress = value;
        }
    }
}
