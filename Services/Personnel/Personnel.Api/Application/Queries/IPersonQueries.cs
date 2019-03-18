using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Personnel.Api.Application.Queries
{
    public interface IPersonQueries
    {
        Task<bool> UserNameOrEmailExists(string userName, string email);
    }
}
