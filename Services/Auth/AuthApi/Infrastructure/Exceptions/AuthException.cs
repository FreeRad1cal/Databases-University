using System;
using System.Collections.Generic;
using System.Linq;

namespace AuthApi.Infrastructure.Exceptions
{
    public class AuthException : Exception
    {
        public IEnumerable<string> Errors { get; set; } = Enumerable.Empty<string>();
    }
}
