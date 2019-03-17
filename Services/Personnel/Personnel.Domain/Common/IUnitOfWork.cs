using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Personnel.Domain.Common
{
    public interface IUnitOfWork
    {
        Task SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken));
        void AddDispatchingOperation(Entity entity, Func<IDbConnection, Entity, Task> operation);
        void AddNondispatchingOperation(ValueObject valueObject, Func<IDbConnection, ValueObject, Task> operation);
    }
}
