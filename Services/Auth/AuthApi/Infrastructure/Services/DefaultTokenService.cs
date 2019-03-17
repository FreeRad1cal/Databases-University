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
            const string personSql = @"SELECT Id, Hash, Salt FROM People WHERE UserName = @UserName";
            const string claimsSql = @"SELECT Type, Value FROM Claims WHERE PersonId = @Id";

            using (var conn = await GetDbConnectionAsync())
            {
                var person = await conn.QueryFirstOrDefaultAsync<Person>(personSql, new {UserName = userName});
                if (person == null ||
                    !SaltedHashHelper.VerifyPasswordAgainstSaltedHash(password, person.Hash, person.Salt))
                {
                    throw new AuthException();
                }

                var claims = (await conn.QueryAsync<Claim>(claimsSql, new {PersonId = person.Id}))
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
