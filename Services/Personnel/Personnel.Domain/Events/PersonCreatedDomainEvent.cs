using System;
using System.Collections.Generic;
using System.Text;
using MediatR;
using Personnel.Domain.AggregateModel.PersonAggregate;

namespace Personnel.Domain.Events
{
    public class PersonCreatedDomainEvent : INotification
    {
        public Person Person { get; }

        public PersonCreatedDomainEvent(Person person)
        {
            Person = person;
        }
    }
}
