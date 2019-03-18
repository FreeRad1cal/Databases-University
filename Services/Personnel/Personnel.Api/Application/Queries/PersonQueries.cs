using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using Personnel.Api.Dtos;

namespace Personnel.Api.Application.Queries
{
    public class PersonQueries : IPersonQueries
    {
        private PersonnelApiSettings _settings;

        public PersonQueries(IOptions<PersonnelApiSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task<bool> UserNameOrEmailExists(string userName, string email)
        {
            var sql = $@"SELECT * FROM People
                        WHERE UserName = @{nameof(userName)} OR Email = @{nameof(email)}
                        LIMIT 1";

            using (var conn = await GetDbConnectionAsync())
            {
                var person = await conn.QueryFirstOrDefaultAsync(sql, new { userName, email });
                return person != null;
            }
        }

        private async Task<IDbConnection> GetDbConnectionAsync()
        {
            var connection = new MySqlConnection(_settings.ConnectionString);
            await connection.OpenAsync();
            return connection;
        }
    }
}
