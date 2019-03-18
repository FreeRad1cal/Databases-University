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
using Personnel.Domain.Common;
using Personnel.Domain.PersonAggregate;
using Personnel.Infrastructure.UnitOfWork;

namespace Personnel.Infrastructure.Repositories
{
    public class PersonRepository : IPersonRepository
    {
        public IUnitOfWork UnitOfWork { get; }

        public PersonRepository(IMediator mediator, IOptions<DbConnectionInfo> connInfo)
        {
            UnitOfWork = new MySqlUnitOfWork(mediator, connInfo.Value.ConnectionString);
        }

        public Person Add(Person person, string salt, string hash)
        {
            var personSql = $@"INSERT INTO People (Username, Email, PasswordSalt, PasswordHash)
                        VALUES (@{nameof(person.UserName)}, @{nameof(person.Email)}, @PasswordSalt, @PasswordHash);
                        SELECT LAST_INSERT_ID();";
            UnitOfWork.AddOperation(person, async connection =>
            {
                var id = await connection.QueryFirstAsync<int>(personSql, person);
                person.Id = id;
            });

            foreach (var (address, type) in new[] { (person.HomeAddress, "Home"), (person.MailingAddress, "Mailing") })
            {
                var addressSql = $@"INSERT INTO Addresses (Street, City, State, Country, Zipcode)
                            VALUES (@{nameof(address.Street)}, @{nameof(address.City)}, @{nameof(address.State)}, @{nameof(address.Country)}, @{nameof(address.ZipCode)} )
                            ON DUPLICATE KEY UPDATE Id = LAST_INSERT_ID(Id);
                            SELECT LAST_INSERT_ID()";
                UnitOfWork.AddOperation(address,
                    async connection =>
                    {
                        var id = await connection.QueryFirstAsync<int>(addressSql, address);
                        address.Id = id;
                    });

                var personAddressMapSql = $@"INSERT INTO PersonAddressMap (PersonId, AddressId, Type)
                                            VALUES (@PersonId, @AddressId, @Type);";
                UnitOfWork.AddOperation(new object(), async connection =>
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

        public async Task<Person> GetAsync(int personId)
        {
            throw new NotImplementedException();
        }
    }
}
