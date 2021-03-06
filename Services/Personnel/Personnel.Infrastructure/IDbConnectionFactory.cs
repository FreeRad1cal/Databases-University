﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace Personnel.Infrastructure
{
    public interface IDbConnectionFactory
    {
        Task<IDbConnection> GetConnectionAsync();
    }
}
