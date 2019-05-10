using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AuthApi.Models;

namespace AuthApi.Infrastructure.Services
{
    public interface IUserService
    {
        Task<bool> AddUser(int id, string userName, string password);

        Task<bool> ValidateCredentials(LoginCredentials credentials);
    }
}
