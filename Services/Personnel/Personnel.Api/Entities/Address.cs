﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Personnel.Api.Entities
{
    public class Address
    {
        public string City { get; set; }

        public string Street { get; set; }

        public string Country { get; set; }

        public string ZipCode { get; set; }
    }
}
