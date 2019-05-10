using System;
using System.Collections.Generic;
using System.Text;
using MediatR;
using Personnel.Domain.AggregateModel.PersonAggregate;

namespace Personnel.Domain.Events
{
    public class PersonRegisteredDomainEvent : INotification
    {
        public Person Person { get; }

        public PersonRegisteredDomainEvent(Person person)
        {
            Person = person;
        }
    }
}
