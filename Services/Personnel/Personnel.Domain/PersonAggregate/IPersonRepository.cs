using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Personnel.Domain.Common;

namespace Personnel.Domain.PersonAggregate
{
    public interface IPersonRepository : IRepository<Person>
    {
        Person Add(Person person);

        void Update(Person person);

        Task<Person> GetAsync(int personId);
    }
}
