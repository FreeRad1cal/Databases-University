using System;
using System.Collections.Generic;
using System.Text;
using MediatR;
using Personnel.Domain.AggregateModel.PersonAggregate;

namespace Personnel.Domain.Events
{
    public class AddressChangedEvent : INotification
    {
        public Person Person { get; }
        public string AddressType { get; }

        public AddressChangedEvent(Person person, string addressType)
        {
            Person = person;
            AddressType = addressType;
        }
    }
}
