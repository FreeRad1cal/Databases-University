using System.Threading.Tasks;
using Personnel.Api.Dtos;

namespace Personnel.Api.Application.Queries
{
    public interface IPersonQueries
    {
        Task<bool> UserNameOrEmailExists(string userName, string email);
        Task<PersonDto> GetPersonByIdAsync(int id);
        Task<bool> HasJobTitle(int personId, string titleName);
    }
}
