using System;
using System.Collections.Generic;
using System.Text;
using Personnel.Domain.Common;
using Personnel.Domain.Events;
using Personnel.Domain.PersonAggregate;

namespace Personnel.Domain.EmployeeAggregate
{
    public class Employee : Entity, IAggregateRoot
    {
        public Person Person { get; }
        public Title TitleName { get; }
        public DateTime HireDate { get; }

        public Employee(Person person, string titleName)
        {
            Person = person;
            TitleName = new Title(titleName);
            HireDate = DateTime.Now;

            AddDomainEvent(new EmployeeCreatedDomainEvent(this));
        }

    }
}
