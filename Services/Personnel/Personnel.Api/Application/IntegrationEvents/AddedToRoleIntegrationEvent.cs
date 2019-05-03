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
        public int PersonId { get; }

        public string Role { get; }

        public AddedToRoleIntegrationEvent(int personId, string role)
        {
            PersonId = personId;
            Role = role;
        }
    }
}
