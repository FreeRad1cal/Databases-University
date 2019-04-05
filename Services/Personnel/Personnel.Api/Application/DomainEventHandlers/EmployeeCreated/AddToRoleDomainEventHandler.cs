using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using Personnel.Api.Application.IntegrationEvents;
using Personnel.Domain.EmployeeAggregate;
using Personnel.Domain.Events;
using SecureChat.Common.Events.EventBus.Abstractions;

namespace Personnel.Api.Application.DomainEventHandlers.EmployeeCreated
{
    public class AddToRoleDomainEventHandler : INotificationHandler<EmployeeCreatedDomainEvent>
    {
        private readonly IEventBus _eventBus;
        private readonly ILogger<AddToRoleDomainEventHandler> _logger;

        public AddToRoleDomainEventHandler(IEventBus eventBus, ILogger<AddToRoleDomainEventHandler> logger)
        {
            _eventBus = eventBus;
            _logger = logger;
        }

        public async Task Handle(EmployeeCreatedDomainEvent notification, CancellationToken cancellationToken)
        {
            _eventBus.Publish(new AddedToRoleIntegrationEvent(notification.Employee.Id, nameof(Employee)));

            _logger.LogTrace($"Added {notification.Employee.Id} to role {nameof(Employee)}");
        }
    }
}
