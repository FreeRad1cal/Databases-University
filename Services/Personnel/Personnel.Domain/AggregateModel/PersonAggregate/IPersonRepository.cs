using System.Threading.Tasks;
using Personnel.Domain.Common;

namespace Personnel.Domain.AggregateModel.PersonAggregate
{
    public interface IPersonRepository : IRepository<Person>
    {
        Person Add(Person person, string salt, string hash);

        void Update(Person person);

        Task<Person> GetAsync(int personId);
    }
}
