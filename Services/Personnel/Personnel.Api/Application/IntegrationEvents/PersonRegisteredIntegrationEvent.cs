using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SecureChat.Common.Events.EventBus.Events;

namespace Personnel.Api.Application.IntegrationEvents
{
    public class PersonRegisteredIntegrationEvent : IntegrationEvent
    {
        public string UserName { get; set; }

        public string Password { get; set; }

        public int UserId { get; set; }

        public PersonRegisteredIntegrationEvent(int id, string password, string userName)
        {
            UserId = id;
            Password = password;
            UserName = userName;
        }
    }
}
