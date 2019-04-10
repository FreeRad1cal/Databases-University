using System;
using Personnel.Domain.AggregateModel.JobPostingAggregate;
using Personnel.Domain.AggregateModel.PersonAggregate;
using Personnel.Domain.Common;
using Personnel.Domain.Events;

namespace Personnel.Domain.AggregateModel.EmployeeAggregate
{
    public class Employee : Entity, IAggregateRoot
    {
        public Person Person { get; }
        public JobTitle JobTitle { get; }
        public DateTime HireDate { get; }

        public Employee(Person person, JobTitle jobTitle)
        {
            Person = person;
            JobTitle = jobTitle;
            HireDate = DateTime.Now;

            AddDomainEvent(new EmployeeCreatedDomainEvent(this));
        }

    }
}
