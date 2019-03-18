using System;
using System.Collections.Concurrent;
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
    class OperationDescriptor
    {
        public Guid Id { get; } = new Guid();
        public object Entity { get; }
        public Func<IDbConnection, Task> Operation { get; }

        public bool IsDispatching =>
            Entity.GetType() == typeof(Entity);

        public OperationDescriptor(object entity, Func<IDbConnection, Task> operation)
        {
            Entity = entity;
            Operation = operation;
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }
    }

    // Not thread-safe
    public class MySqlUnitOfWork : IUnitOfWork
    {
        private readonly IMediator _mediator;
        private readonly string _connectionString;

        private readonly object _syncRoot = new object();

        private List<OperationDescriptor> _operations = new List<OperationDescriptor>();

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
                foreach (var operation in _operations)
                {
                    await operation.Operation(conn);
                    if (operation.IsDispatching)
                    {
                        await DispatchDomainEventsAsync(operation.Entity as Entity);
                    }

                    _operations.Remove(operation);
                }

                transaction.Commit();
            }
        }

        public void AddOperation(object entity, Func<IDbConnection, Task> operation)
        {
            _operations.Add(new OperationDescriptor(entity, operation));
        }

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
