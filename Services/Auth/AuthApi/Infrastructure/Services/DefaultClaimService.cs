using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using AuthApi.Entities;
using Dapper;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;

namespace AuthApi.Infrastructure.Services
{
    public class DefaultClaimService : IClaimService
    {
        private readonly AuthApiSettings _authApiSettings;

        public DefaultClaimService(IOptions<AuthApiSettings> authApiSettings)
        {
            _authApiSettings = authApiSettings.Value;
        }

        public async Task<bool> AddClaim(Claim claim)
        {
            var affectedRows = await AddClaims(new[] { claim });
            return affectedRows > 0;
        }

        public async Task<bool> RemoveClaim(Claim claim)
        {
            var affectedRows = await RemoveClaims(new[] {claim});
            return affectedRows > 0;
        }

        public async Task<int> AddClaims(IEnumerable<Claim> claims)
        {
            var sql = $@"INSERT INTO Claims (Type, Value, PersonId)
                        VALUES (@{nameof(Claim.Type)}, @{nameof(Claim.Value)}, @{nameof(Claim.PersonId)})";

            using (var conn = await GetDbConnectionAsync())
            {
                var affectedRows = await conn.ExecuteAsync(sql, claims);
                return affectedRows;
            }
        }

        public async Task<int> RemoveClaims(IEnumerable<Claim> claims)
        {
            var sql = $@"DELETE FROM Claims 
                        WHERE Type = @{nameof(Claim.Type)}, Value = @{nameof(Claim.Value)}, PersonId = @{nameof(Claim.PersonId)})";

            using (var conn = await GetDbConnectionAsync())
            {
                var affectedRows = await conn.ExecuteAsync(sql, claims);
                return affectedRows;
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
