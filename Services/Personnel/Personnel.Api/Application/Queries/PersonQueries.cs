using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using Personnel.Api.Dtos;
using Personnel.Infrastructure;

namespace Personnel.Api.Application.Queries
{
    public class PersonQueries : IPersonQueries
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;
        private PersonnelApiSettings _settings;

        public PersonQueries(IOptions<PersonnelApiSettings> settings, IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
            _settings = settings.Value;
        }

        public async Task<bool> UserNameOrEmailExists(string userName, string email)
        {
            var sql = $@"SELECT * FROM People
                        WHERE UserName = @{nameof(userName)} OR Email = @{nameof(email)}
                        LIMIT 1";

            using (var conn = await _dbConnectionFactory.GetConnectionAsync())
            {
                var person = await conn.QueryFirstOrDefaultAsync(sql, new { userName, email });
                return person != null;
            }
        }

        public async Task<PersonDto> GetPersonById(int id)
        {
            var sql = $@"SELECT * FROM People
                        WHERE Id = @Id
                        LIMIT 1";

            using (var conn = await _dbConnectionFactory.GetConnectionAsync())
            {
                var person = await conn.QueryFirstOrDefaultAsync(sql, new { Id = id });
                return person != null;
            }
        }
    }
}
