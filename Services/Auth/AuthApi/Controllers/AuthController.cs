using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using AuthApi.Infrastructure.Exceptions;
using AuthApi.Infrastructure.Services;
using AuthApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace AuthApi.Controllers
{
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly IUserService _userService;

        public AuthController(ITokenService tokenService, IUserService userService)
        {
            _tokenService = tokenService;
            _userService = userService;
        }

        [HttpPost("authenticate", Name = nameof(Authenticate))]
        public async Task<IActionResult> Authenticate([Required] LoginCredentials credentials)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            if (!await _userService.ValidateCredentials(credentials))
            {
                return Unauthorized(new ErrorResponse()
                {
                    Errors = new[] { "Invalid username or password" }
                });
            }

            var jwt = await _tokenService.GetTokenFromLoginCredentialsAsync(credentials.UserName, credentials.Password);
            return new JsonResult(jwt);
        }
    }
}
