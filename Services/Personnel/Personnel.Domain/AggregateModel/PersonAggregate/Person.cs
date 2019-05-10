using System.Collections.Generic;
using System.Linq;
using Personnel.Domain.AggregateModel.JobPostingAggregate;
using Personnel.Domain.Common;
using Personnel.Domain.Events;
using Personnel.Domain.Exceptions;

namespace Personnel.Domain.AggregateModel.PersonAggregate
{
    public class Person : Entity, IAggregateRoot
    {
        public IEnumerable<JobTitle> JobTitles
        {
            get => _jobTitles;
            private set => _jobTitles = value as List<JobTitle>;
        }

        private List<JobTitle> _jobTitles = new List<JobTitle>();

        private Person() { }

        public Person(string userName, string email, string firstName, string lastName, Address homeAddress, Address mailingAddress = null)
        {
            UserName = userName;
            Email = email;
            FirstName = firstName;
            LastName = lastName;
            HomeAddress = homeAddress;
            MailingAddress = mailingAddress;

            AddDomainEvent(new PersonRegisteredDomainEvent(this));
        }

        public string UserName { get; private set; }

        public string FirstName { get; private set; }

        public string LastName { get; private set; }

        public string Email { get; private set; }

        public Address HomeAddress { get; private set; }

        private Address _mailingAddress;
        public Address MailingAddress
        {
            get => _mailingAddress ?? HomeAddress;
            private set => _mailingAddress = value;
        }

        public void ChangeHomeAddress(Address address)
        {
            if (address == null)
            {
                throw new PersonnelDomainException("Could not change home address",
                    new[] {"The home address cannot be null"});
            }

            if (!address.Equals(HomeAddress))
            {
                HomeAddress = address;
                AddDomainEvent(new AddressChangedEvent(this, "Home"));
            }
        }

        public void ChangeMailingAddress(Address address)
        {
            if (MailingAddress?.Equals(address) ?? MailingAddress == address)
            {
                return;
            }

            MailingAddress = address;
            AddDomainEvent(new AddressChangedEvent(this, "Mailing"));
        }

        public bool HasJobTitle(JobTitle jobTitle) =>
            JobTitles.Any(jt => jt.Equals(jobTitle));

        public void Hire(JobTitle jobTitle)
        {
            if (HasJobTitle(jobTitle))
            {
                throw new PersonnelDomainException("Could not assign person to title",
                    new[] {$"Person already employed as {jobTitle.Name}"});
            }

            if (!_jobTitles.Any())
            {
                AddDomainEvent(new NewHireDomainEvent(this));
            }

            _jobTitles.Add(jobTitle);
        }
    }
}
