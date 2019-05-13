using Newtonsoft.Json;
using SecureChat.Common.Events.EventBus.Events;

namespace AuthApi.IntegrationEvents.Events
{
    public class PersonRegisteredIntegrationEvent : IntegrationEvent
    {
        [JsonProperty]
        public string UserName { get; set; }

        [JsonProperty]
        public string Password { get; set; }

        [JsonProperty]
        public int UserId { get; set; }
    }
}
