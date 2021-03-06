﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Personnel.Api.Dtos
{
    public class AddressDto
    {
        public string City { get; set; }

        public string Street { get; set; }

        public string Country { get; set; }

        public string ZipCode { get; set; }

        public string State { get; set; }
    }
}
