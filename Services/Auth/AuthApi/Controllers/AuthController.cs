using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using AuthApi.Infrastructure.Exceptions;
using AuthApi.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuthApi.Controllers
{
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ITokenService _tokenService;

        public AuthController(ITokenService tokenService)
        {
            _tokenService = tokenService;
        }

        [HttpPost("authenticate", Name = nameof(Authenticate))]
        public async Task<IActionResult> Authenticate([Required] string userName, [Required] string password)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            try
            {
                var jwt = await _tokenService.AuthorizeAndGetTokenAsync(userName, password);
                return Ok(jwt);
            }
            catch (AuthException)
            {
                return Unauthorized();
            }
        }
    }
}
