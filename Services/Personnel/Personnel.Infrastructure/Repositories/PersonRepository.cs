using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using MediatR;
using Microsoft.Extensions.Options;
using Personnel.Domain.AggregateModel.JobPostingAggregate;
using Personnel.Domain.AggregateModel.PersonAggregate;
using Personnel.Domain.Common;
using Personnel.Infrastructure.UnitOfWork;

namespace Personnel.Infrastructure.Repositories
{
    public class PersonRepository : IPersonRepository
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;
        private readonly IMapper _mapper;
        public IUnitOfWork UnitOfWork { get; }

        public PersonRepository(IUnitOfWork unitOfWork, IDbConnectionFactory dbConnectionFactory, IMapper mapper)
        {
            _dbConnectionFactory = dbConnectionFactory;
            _mapper = mapper;
            UnitOfWork = unitOfWork;
        }

        public Person Add(Person person, string salt, string hash)
        {
            var personSql = $@"INSERT INTO People (Username, FirstName, LastName, Email, PasswordSalt, PasswordHash)
                        VALUES (@{nameof(person.UserName)}, @{nameof(person.FirstName)}, @{nameof(person.LastName)}, @{nameof(person.Email)}, @PasswordSalt, @PasswordHash);
                        SELECT LAST_INSERT_ID();";
            UnitOfWork.AddOperation(person, async connection =>
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
                InsertAddressIfNotExists(address, type, person);
            }

            return person;
        }

        public void Update(Person person)
        {
            var sql = $@"UPDATE People SET 
                            UserName = @{nameof(person.UserName)},
                            FirstName = @{nameof(person.FirstName)},
                            LastName = @{nameof(person.LastName)},
                            Email = @{nameof(person.Email)}
                        WHERE People.Id = @{nameof(person.Id)}";

            UnitOfWork.AddOperation(person, async connection =>
            {
                await connection.ExecuteAsync(sql, person);
            });

            var addresses = new List<(Address, string)>
            {
                (person.MailingAddress, "Mailing"),
                (person.HomeAddress, "Home")
            };

            foreach (var pair in addresses)
            {
                var address = pair.Item1;
                var type = pair.Item2;
                if (address != null)
                {
                    DeleteAddressTypeByPersonId(type, person);
                    InsertAddressIfNotExists(address, type, person);
                }
            }

            AddToJobTitles(person.JobTitles, person);
        }

        // Note include Get method when you need an aggregate root object
        public async Task<Person> GetAsync(int personId)
        {
            var sql = $@"SELECT * FROM People
                        JOIN PersonAddressMap map ON map.PersonId = People.Id
                        JOIN Addresses ON Addresses.Id = map.AddressId
                        LEFT JOIN Contracts ON Contracts.PersonId = People.Id
                        LEFT JOIN JobTitles ON Contracts.TitleName = JobTitles.Name
                        WHERE People.Id = @{nameof(personId)}";

            using (var conn = await _dbConnectionFactory.GetConnectionAsync())
            {
                var addressDictionary = new Dictionary<string, Address>();
                var jobTitles = new HashSet<JobTitle>();
                var result = await conn.QueryAsync<dynamic, dynamic, Address, JobTitle, dynamic>(sql, (person, personAddrMap, address, jobTitle) =>
                    {
                        addressDictionary[personAddrMap.Type] = address;
                        jobTitles.Add(jobTitle);
                        return person;
                    },
                    param: new { personId },
                    splitOn: "Type,Id,Name");
                var dynamicPerson = result
                    .FirstOrDefault();
                if (dynamicPerson == null)
                {
                    return null;
                }

                dynamicPerson.HomeAddress = addressDictionary["Home"];
                if (addressDictionary.ContainsKey("Mailing"))
                {
                    dynamicPerson.HomeAddress = addressDictionary["Home"];
                }

                dynamicPerson.JobTitles = jobTitles.Where(jt => jt != null).ToList();

                return _mapper.Map<Person>(dynamicPerson);
            }
        }

        private void InsertAddressIfNotExists(Address address, string type, Person person)
        {
            var sql = $@"INSERT INTO Addresses (Street, City, State, Country, Zipcode)
                                SELECT @{nameof(address.Street)}, @{nameof(address.City)}, @{nameof(address.State)}, @{nameof(address.Country)}, @{nameof(address.ZipCode)}
                                FROM DUAL
                                WHERE NOT EXISTS (SELECT * FROM Addresses a WHERE a.Street=@{nameof(address.Street)} AND a.City=@{nameof(address.City)} AND a.State=@{nameof(address.State)} AND a.Country=@{nameof(address.Country)} AND a.ZipCode=@{nameof(address.ZipCode)}) 
                                LIMIT 1;
                                SELECT Id from Addresses a WHERE a.Street=@{nameof(address.Street)} AND a.City=@{nameof(address.City)} AND a.State=@{nameof(address.State)} AND a.Country=@{nameof(address.Country)} AND a.ZipCode=@{nameof(address.ZipCode)}";
            UnitOfWork.AddOperation(address,
                async connection =>
                {
                    var id = await connection.QueryFirstAsync<int>(sql, address);
                    address.Id = id;
                });

            var personAddressMapSql = $@"INSERT IGNORE INTO PersonAddressMap (PersonId, AddressId, Type)
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

        private void DeleteAddressTypeByPersonId(string type, Person person)
        {
            var sql = $@"DELETE FROM PersonAddressMap WHERE PersonAddressMap.PersonId = @{nameof(person.Id)} AND PersonAddressMap.Type = @{nameof(type)}";
            UnitOfWork.AddOperation(new object(), async connection =>
            {
                await connection.ExecuteAsync(sql, new {type, person.Id});
            });
        }

        private void AddToJobTitles(IEnumerable<JobTitle> jobTitles, Person person)
        {
            var sql = $@"INSERT IGNORE INTO Contracts (TitleName, PersonId)
                        VALUES (@{nameof(JobTitle.Name)}, @{nameof(person.Id)})";
            var contracts = jobTitles.Select(jobTitle => new {jobTitle.Name, person.Id});
            UnitOfWork.AddOperation(new object(), async connection => await connection.ExecuteAsync(sql, contracts));
        }
    }
}
