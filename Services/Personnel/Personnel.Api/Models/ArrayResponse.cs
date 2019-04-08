using System.Collections.Generic;

namespace Personnel.Api.Models
{
    public class ArrayResponse<T>
    {
        public int Total { get; set; }

        public IEnumerable<T> Items { get; set; }
    }
}
