using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AuthApi.Infrastructure.Services;
using AuthApi.IntegrationEvents.Events;
using SecureChat.Common.Events.EventBus.Abstractions;

namespace AuthApi.IntegrationEvents.EventHandling
{
    public class PersonRegisteredIntegrationEventHandler : IIntegrationEventHandler<PersonRegisteredIntegrationEvent>
    {
        private readonly IUserService _userService;

        public PersonRegisteredIntegrationEventHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task Handle(PersonRegisteredIntegrationEvent integrationEvent)
        {
            await _userService.AddUser(integrationEvent.UserId, integrationEvent.UserName, integrationEvent.Password);
        }
    }
}
