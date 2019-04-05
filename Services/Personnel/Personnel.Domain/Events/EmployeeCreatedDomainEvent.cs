using System;
using System.Collections.Generic;
using System.Text;
using MediatR;
using Personnel.Domain.EmployeeAggregate;

namespace Personnel.Domain.Events
{
    public class EmployeeCreatedDomainEvent : INotification
    {
        public Employee Employee { get; }

        public EmployeeCreatedDomainEvent(Employee employee)
        {
            Employee = employee;
        }
    }
}
