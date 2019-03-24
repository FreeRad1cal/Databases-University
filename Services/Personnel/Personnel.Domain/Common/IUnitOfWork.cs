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
        Task SaveChangesAsync();
        void AddOperation(object entity, Func<IDbConnection, Task> operation);
    }
}
