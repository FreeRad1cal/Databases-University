using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using SecureChat.Common.Events.EventBus.Events;

namespace AuthApi.IntegrationEvents.Events
{
    public class PermissionsRemovedIntegrationEvent : IntegrationEvent
    {
        [JsonProperty]
        public string PersonId { get; private set; }

        [JsonProperty]
        public IEnumerable<string> Permissions { get; private set; }
    }
}
