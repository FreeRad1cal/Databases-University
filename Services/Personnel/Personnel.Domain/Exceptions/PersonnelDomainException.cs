using System;
using System.Collections.Generic;
using System.Text;

namespace Personnel.Domain.Exceptions
{
    public class PersonnelDomainException : Exception
    {
        public IEnumerable<string> Errors { get; } = new List<string>();

        public PersonnelDomainException()
        { }

        public PersonnelDomainException(string message, IEnumerable<string> errors = null)
            : base(message)
        {
            if (errors != null) Errors = errors;
        }

        public PersonnelDomainException(string message, Exception innerException, IEnumerable<string> errors = null)
            : base(message, innerException)
        {
            if (errors != null) Errors = errors;
        }
    }
}
