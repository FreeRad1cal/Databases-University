using System.Collections.Generic;

namespace Personnel.Api.Infrastructure.Services
{
    public interface IIdentityService
    {
        int GetUserIdentity();

        IEnumerable<string> GetRoles();
    }
}
