using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Personnel.Api.Infrastructure.Services
{
    public class IdentityService : IIdentityService
    {
        private readonly IHttpContextAccessor _context;

        public IdentityService(IHttpContextAccessor context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public int GetUserIdentity()
        {
            return int.Parse(_context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
        }

        public string GetUserName()
        {
            return _context.HttpContext.User.Identity.Name;
        }
    }
}
