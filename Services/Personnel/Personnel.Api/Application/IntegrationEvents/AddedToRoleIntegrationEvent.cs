using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using SecureChat.Common.Events.EventBus.Events;

namespace Personnel.Api.Application.IntegrationEvents
{
    public class AddedToRoleIntegrationEvent : IntegrationEvent
    {
        [JsonProperty]
        public int PersonId { get; private set; }

        [JsonProperty]
        public string Role { get; private set; }

        public AddedToRoleIntegrationEvent(int personId, string role)
        {
            PersonId = personId;
            Role = role;
        }
    }
}
