using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using Personnel.Api.Dtos;
using Personnel.Domain.PersonAggregate;
using Personnel.Infrastructure;

namespace Personnel.Api.Application.Queries
{
    public class PersonQueries : IPersonQueries
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;
        private readonly IMapper _mapper;
        private PersonnelApiSettings _settings;

        public PersonQueries(IOptions<PersonnelApiSettings> settings, IDbConnectionFactory dbConnectionFactory, IMapper mapper)
        {
            _dbConnectionFactory = dbConnectionFactory;
            _mapper = mapper;
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

        public async Task<PersonDto> GetPersonByIdAsync(int id)
        {
            var sql = $@"SELECT * FROM People
                        INNER JOIN PersonAddressMap map ON map.PersonId = People.Id
                        INNER JOIN Addresses ON Addresses.Id = map.AddressId
                        WHERE People.Id = @Id";

            using (var conn = await _dbConnectionFactory.GetConnectionAsync())
            {
                var addressDictionary = new Dictionary<string, AddressDto>();
                var result = await conn.QueryAsync<PersonDto, dynamic, PersonDto>(sql, (per, addr) =>
                    {
                        var address = _mapper.Map<AddressDto>(addr);
                        addressDictionary[addr.Type] = address;
                        return per;
                    }, 
                    param: new {Id = id},
                    splitOn: "Type");
                var person = result
                    .FirstOrDefault();
                if (person == null)
                {
                    return null;
                }

                person.HomeAddress = addressDictionary["Home"];
                if (addressDictionary.ContainsKey("Mailing"))
                {
                    person.HomeAddress = addressDictionary["Home"];
                }

                return person;
            }
        }
    }
}
