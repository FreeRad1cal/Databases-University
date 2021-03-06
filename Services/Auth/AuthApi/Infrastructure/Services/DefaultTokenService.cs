﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AuthApi.Entities;
using AuthApi.Infrastructure.Exceptions;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using Dapper;
using Helpers;
using Microsoft.IdentityModel.Tokens;
using Claim = AuthApi.Entities.Claim;

namespace AuthApi.Infrastructure.Services
{
    public class DefaultTokenService : ITokenService
    {
        private readonly AuthApiSettings _authApiSettings;

        public DefaultTokenService(IOptions<AuthApiSettings> authApiSettings)
        {
            _authApiSettings = authApiSettings.Value;
        }

        public async Task<string> GetTokenFromLoginCredentialsAsync(string userName, string password)
        {
            const string sql = @"SELECT Users.Id, PasswordHash, PasswordSalt, Type, Value 
                                FROM Users
                                LEFT JOIN Claims ON Users.Id = Claims.UserId
                                WHERE Users.UserName = @UserName;";

            using (var conn = await GetDbConnectionAsync())
            {
                var customClaims = new List<Claim>();
                var person = (await conn.QueryAsync<Person, Claim, Person>(sql, (p, c) =>
                    {
                        customClaims.Add(c);
                        return p;
                    }, param: new {UserName = userName}, splitOn: "Type"))
                    .FirstOrDefault();
                if (person == null)
                {
                    throw new InvalidOperationException();
                }

                var claims = customClaims
                    .Where(claim => claim != null && !string.IsNullOrEmpty(claim.Value) && !string.IsNullOrEmpty(claim.Type))
                    .Select(claim => new System.Security.Claims.Claim(claim.Type, claim.Value))
                    .Concat(new [] { new System.Security.Claims.Claim("sub", person.Id) });

                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_authApiSettings.Secret);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.UtcNow.AddDays(7),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }
        }

        private async Task<IDbConnection> GetDbConnectionAsync()
        {
            var connection = new MySqlConnection(_authApiSettings.ConnectionString);
            await connection.OpenAsync();
            return connection;
        }
    }
}
