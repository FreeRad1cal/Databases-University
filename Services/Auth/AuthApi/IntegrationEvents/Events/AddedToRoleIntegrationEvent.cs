using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using SecureChat.Common.Events.EventBus.Events;

namespace AuthApi.IntegrationEvents.Events
{
    public class AddedToRoleIntegrationEvent : IntegrationEvent
    {
        [JsonProperty]
        public int PersonId { get; private set; }

        [JsonProperty]
        public string Role { get; private set; }
    }
}
