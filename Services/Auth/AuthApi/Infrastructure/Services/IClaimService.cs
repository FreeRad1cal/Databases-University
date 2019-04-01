using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AuthApi.Entities;

namespace AuthApi.Infrastructure.Services
{
    public interface IClaimService
    {
        Task<int> AddClaims(IEnumerable<Claim> claims);
        Task<int> RemoveClaims(IEnumerable<Claim> claims);
        Task<bool> AddClaim(Claim claim);
        Task<bool> RemoveClaim(Claim claim);
    }
}
