using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Personnel.Domain.Common
{
    public interface IRepository<T> : IUnitOfWork
        where T : IAggregateRoot
    {
    }
}
