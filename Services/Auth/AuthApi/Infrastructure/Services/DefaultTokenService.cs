using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AuthApi.Entities;
using AuthApi.Models;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using Dapper;
using Microsoft.IdentityModel.Tokens;
using CustomClaim = AuthApi.Entities.CustomClaim;

namespace AuthApi.Infrastructure.Services
{
    public class DefaultTokenService : ITokenService
    {
        private AuthApiSettings _authApiSettings;

        public DefaultTokenService(IOptions<AuthApiSettings> authApiSettings)
        {
            _authApiSettings = authApiSettings.Value;
        }

        public async Task<string> Authenticate(string userName, string password)
        {
            const string personSql = @"SELECT Id, FirstName, LastName, UserName FROM People WHERE UserName = @UserName AND Password = @Password";
            const string claimsSql = @"SELECT Type, Value FROM Claims WHERE PersonId = @Id";

            using (var conn = await GetConnection())
            {
                var person = await conn.QueryFirstOrDefaultAsync<Person>(personSql, new {UserName = userName, Password = password}) 
                             ?? throw new ApiException();
                var claims = (await conn.QueryAsync<CustomClaim>(claimsSql, new {PersonId = person.Id}))
                    .Select(claim => new Claim(claim.Type, claim.Value))
                    .Concat(new [] { new Claim("sub", person.Id) });

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

        private async Task<IDbConnection> GetConnection()
        {
            var connection = new MySqlConnection(_authApiSettings.ConnectionString);
            await connection.OpenAsync();
            return connection;
        }
    }
}
