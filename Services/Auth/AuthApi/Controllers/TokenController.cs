using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace AuthApi.Controllers
{
    [ApiController]
    public class TokenController : ControllerBase
    {
        [HttpPost("authenticate", Name = nameof(Authenticate))]
        public void Authenticate([FromBody] string userName, string password)
        {
        }
    }
}
