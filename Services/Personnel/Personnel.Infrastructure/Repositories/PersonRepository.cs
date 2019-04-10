using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using MediatR;
using Microsoft.Extensions.Options;
using Personnel.Domain.AggregateModel.PersonAggregate;
using Personnel.Domain.Common;
using Personnel.Infrastructure.UnitOfWork;

namespace Personnel.Infrastructure.Repositories
{
    public class PersonRepository : SqlUnitOfWork, IPersonRepository
    {
        public PersonRepository(IMediator mediator, IDbConnectionFactory dbConnectionFactory)
            : base(mediator, dbConnectionFactory)
        {
        }

        public Person Add(Person person, string salt, string hash)
        {
            var personSql = $@"INSERT INTO People (Username, FirstName, LastName, Email, PasswordSalt, PasswordHash)
                        VALUES (@{nameof(person.UserName)}, @{nameof(person.FirstName)}, @{nameof(person.LastName)}, @{nameof(person.Email)}, @PasswordSalt, @PasswordHash);
                        SELECT LAST_INSERT_ID();";
            AddOperation(person, async connection =>
            {
                var id = await connection.QueryFirstAsync<int>(personSql, new
                {
                    person.UserName,
                    person.Email,
                    person.FirstName,
                    person.LastName,
                    PasswordSalt = salt,
                    PasswordHash = hash
                });
                person.Id = id;
            });

            var addresses = new Dictionary<Address, string>
            {
                [person.MailingAddress] = "Mailing", [person.HomeAddress] = "Home"
            };
            foreach (var kvp in addresses)
            {
                var address = kvp.Key;
                var type = kvp.Value;
                var addressSql = $@"INSERT INTO Addresses (Street, City, State, Country, Zipcode)
                                SELECT @{nameof(address.Street)}, @{nameof(address.City)}, @{nameof(address.State)}, @{nameof(address.Country)}, @{nameof(address.ZipCode)}
                                FROM DUAL
                                WHERE NOT EXISTS (SELECT * FROM Addresses a WHERE a.Street=@{nameof(address.Street)} AND a.City=@{nameof(address.City)} AND a.State=@{nameof(address.State)} AND a.Country=@{nameof(address.Country)} AND a.ZipCode=@{nameof(address.ZipCode)}) 
                                LIMIT 1;
                                SELECT Id from Addresses a WHERE a.Street=@{nameof(address.Street)} AND a.City=@{nameof(address.City)} AND a.State=@{nameof(address.State)} AND a.Country=@{nameof(address.Country)} AND a.ZipCode=@{nameof(address.ZipCode)}";
                AddOperation(address,
                    async connection =>
                    {
                        var id = await connection.QueryFirstAsync<int>(addressSql, address);
                        address.Id = id;
                    });

                var personAddressMapSql = $@"INSERT INTO PersonAddressMap (PersonId, AddressId, Type)
                                            VALUES (@PersonId, @AddressId, @Type);";
                AddOperation(new object(), async connection =>
                {
                    await connection.ExecuteAsync(personAddressMapSql, new
                    {
                        PersonId = person.Id,
                        AddressId = address.Id,
                        Type = type
                    });
                });
            }

            return person;
        }

        public void Update(Person person)
        {
            throw new NotImplementedException();
        }

        // Note include Get method when you need an aggregate root object
        public async Task<Person> GetAsync(int personId)
        {
            throw new NotImplementedException();
        }
    }
}
