using System;
using System.Collections.Generic;
using System.Text;
using MediatR;
using Personnel.Domain.AggregateModel.PersonAggregate;

namespace Personnel.Domain.Events
{
    public class NewHireDomainEvent : INotification
    {
        public Person Employee { get; }

        public NewHireDomainEvent(Person employee)
        {
            Employee = employee;
        }
    }
}
