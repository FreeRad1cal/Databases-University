using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using Personnel.Api.Application.IntegrationEvents;
using Personnel.Domain.Events;
using SecureChat.Common.Events.EventBus.Abstractions;

namespace Personnel.Api.Application.DomainEventHandlers.EmployeeCreated
{
    public class AddToDefaultRoleDomainEventHandler : INotificationHandler<NewHireDomainEvent>
    {
        private readonly IEventBus _eventBus;
        private readonly ILogger<AddToDefaultRoleDomainEventHandler> _logger;

        public AddToDefaultRoleDomainEventHandler(IEventBus eventBus, ILogger<AddToDefaultRoleDomainEventHandler> logger)
        {
            _eventBus = eventBus;
            _logger = logger;
        }

        public async Task Handle(NewHireDomainEvent notification, CancellationToken cancellationToken)
        {
            _eventBus.Publish(new AddedToRoleIntegrationEvent(notification.Employee.Id, Roles.Employee));

            _logger.LogTrace($"Added {notification.Employee.Id} to role {Roles.Employee}");

            await Task.CompletedTask;
        }
    }
}
