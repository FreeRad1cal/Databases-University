using System;
using System.Collections.Generic;
using System.Text;

namespace Personnel.Domain.EmployeeAggregate
{
    public class Title
    {
        public string Name { get; }

        public Title(string name)
        {
            Name = name;
        }
    }
}
