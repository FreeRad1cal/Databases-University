﻿using System;
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

        public AuthController(ITokenService tokenService)
        {
            _tokenService = tokenService;
        }

        [HttpPost("authenticate", Name = nameof(Authenticate))]
        public async Task<IActionResult> Authenticate([Required] LoginCredentials credentials)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            try
            {
                var jwt = await _tokenService.GetTokenFromLoginCredentialsAsync(credentials.UserName, credentials.Password);
                return Ok(jwt);
            }
            catch (AuthException)
            {
                return Unauthorized();
            }
        }
    }
}
