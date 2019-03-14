using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AuthApi
{
    public class AuthApiSettings
    {
        public string ConnectionString { get; set; }

        public string Secret { get; set; }

        public int Expires { get; set; }
    }
}
