using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AuthApi.Infrastructure.Services
{
    public interface ITokenService
    {
        Task<string> GetTokenFromLoginCredentialsAsync(string userName, string password);
    }
}
