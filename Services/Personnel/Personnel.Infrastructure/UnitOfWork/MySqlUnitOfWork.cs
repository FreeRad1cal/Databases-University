using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using Personnel.Domain.Common;
using Personnel.Infrastructure.Repositories;

namespace Personnel.Infrastructure.UnitOfWork
{
    public class MySqlUnitOfWork : IUnitOfWork
    {
        private readonly IMediator _mediator;
        private readonly string _connectionString;

        private readonly Dictionary<(Guid, Entity), Func<IDbConnection, Entity, Task>> _dispatchingOperations =
            new Dictionary<(Guid, Entity), Func<IDbConnection, Entity, Task>>();

        private readonly Dictionary<(Guid, ValueObject), Func<IDbConnection, ValueObject, Task>> _nondispatchingOperations =
            new Dictionary<(Guid, ValueObject), Func<IDbConnection, ValueObject, Task>>();

        public MySqlUnitOfWork(IMediator mediator, string connectionString)
        {
            _mediator = mediator;
            _connectionString = connectionString;
        }

        public virtual async Task SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            using (var conn = await GetDbConnectionAsync())
            using (var transaction = conn.BeginTransaction())
            {
                foreach (var kvp in _dispatchingOperations)
                {
                    var (_, entity) = kvp.Key;
                    var operation = kvp.Value;

                    await operation(conn, entity);
                    await DispatchDomainEventsAsync(entity);
                }

                foreach (var kvp in _nondispatchingOperations)
                {
                    var (_, valueObject) = kvp.Key;
                    var operation = kvp.Value;

                    await operation(conn, valueObject);
                }

                transaction.Commit();
            }

            _dispatchingOperations.Clear();
            _nondispatchingOperations.Clear();
        }

        public void AddDispatchingOperation(Entity entity, Func<IDbConnection, Entity, Task> operation) 
            => _dispatchingOperations.Add((new Guid(), entity), operation);

        public void AddNondispatchingOperation(ValueObject valueObject, Func<IDbConnection, ValueObject, Task> operation)
            => _nondispatchingOperations.Add((new Guid(), valueObject), operation);

        private async Task DispatchDomainEventsAsync(Entity entity)
        {
            if (entity.DomainEvents.Any())
            {
                var tasks = entity.DomainEvents
                    .Select(async domainEvent => await _mediator.Publish(domainEvent));

                await Task.WhenAll(tasks);
                entity.ClearDomainEvents();
            }
        }

        private async Task<IDbConnection> GetDbConnectionAsync()
        {
            var connection = new MySqlConnection(_connectionString);
            await connection.OpenAsync();
            return connection;
        }
    }
}
