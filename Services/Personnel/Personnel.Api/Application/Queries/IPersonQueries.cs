using System.Threading.Tasks;
using Personnel.Api.Dtos;

namespace Personnel.Api.Application.Queries
{
    public interface IPersonQueries
    {
        Task<bool> UserNameOrEmailExists(string userName, string email);
        Task<PersonDto> GetPersonById(int id);
    }
}
