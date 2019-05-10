using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using AuthApi.Models;
using Dapper;
using Helpers;
using MySql.Data.MySqlClient;

namespace AuthApi.Infrastructure.Services
{
    public class DefaultUserService : IUserService
    {
        private readonly AuthApiSettings _authApiSettings;

        public DefaultUserService(AuthApiSettings authApiSettings)
        {
            _authApiSettings = authApiSettings;
        }

        public async Task<bool> AddUser(int id, string userName, string password)
        {
            var hashSalt = SaltedHashHelper.GenerateSaltedHash(8, password);

            var sql = $@"INSERT IGNORE INTO Users (Id, UserName, PasswordHash, PasswordSalt)
                        VALUES (@{nameof(id)}, @{nameof(userName)}, @{nameof(hashSalt.Hash)}, @{nameof(hashSalt.Salt)});";

            using (var conn = await GetDbConnectionAsync())
            {
                var affectedRows = await conn.ExecuteAsync(sql, new {
                    id,
                    userName,
                    hashSalt.Hash,
                    hashSalt.Salt
                });
                return affectedRows > 0;
            }
        }

        public async Task<bool> ValidateCredentials(LoginCredentials credentials)
        {
            var sql = $@"SELECT * FROM Users
                        WHERE Users.UserName = @{nameof(credentials.UserName)}";

            using (var conn = await GetDbConnectionAsync())
            {
                var result = await conn.QueryFirstOrDefaultAsync(sql, new
                {
                    credentials.UserName
                });

                return result != null && SaltedHashHelper.VerifyPasswordAgainstSaltedHash(credentials.Password, result.Hash, result.Salt);
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
