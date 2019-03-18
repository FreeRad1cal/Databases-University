using System;
using System.Collections.Generic;
using System.Text;

namespace Personnel.Domain.Exceptions
{
    public class PersonnelDomainException : Exception
    {
        public PersonnelDomainException()
        { }

        public PersonnelDomainException(string message)
            : base(message)
        { }

        public PersonnelDomainException(string message, Exception innerException)
            : base(message, innerException)
        { }
    }
}
