using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Personnel.Api.Infrastructure.Binders;

namespace Personnel.Api.Models
{
    [ModelBinder(BinderType = typeof(PaginationBinder))]
    public class Pagination
    {
        public static Pagination Default => new Pagination()
        {
            Limit = int.MaxValue,
            Offset = 0
        };

        public int Limit { get; set; }
        public int Offset { get; set; }
    }
}
