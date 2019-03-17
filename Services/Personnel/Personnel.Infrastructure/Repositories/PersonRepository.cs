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

        public Person Add(Person person)
        {
            var sql = $@"INSERT INTO People (username, email)
                        VALUES (@{nameof(person.UserName)}, @{nameof(person.Email)});
                        SELECT LAST_INSERT_ID();";
            UnitOfWork.AddDispatchingOperation(person, async (connection, entity) =>
            {
                var id = await connection.QueryFirstAsync<int>(sql, person);
                person.Id = id;
            });

            foreach (var address in new[] {person.HomeAddress, person.MailingAddress})
            {
                var sql2 = $@"INSERT IGNORE INTO Addresses (street, city, state, country, zipcode)
                            VALUES (@{nameof(address.Street)}, @{nameof(address.City)}, @{nameof(address.State)}, @{nameof(address.Country)}, @{nameof(address.ZipCode)} );";
                UnitOfWork.AddNondispatchingOperation(address,
                    async (connection, valueObject) => await connection.QueryAsync(sql2, valueObject));
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
