using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AuthApi.Entities
{
    public class Claim
    {
        public int PersonId { get; private set; }

        public string Type { get; private set; }

        public string Value { get; private set; }

        public Claim() { }

        public Claim(int personId, string type, string value)
        {
            PersonId = personId;
            Type = type;
            Value = value;
        }
    }
}
