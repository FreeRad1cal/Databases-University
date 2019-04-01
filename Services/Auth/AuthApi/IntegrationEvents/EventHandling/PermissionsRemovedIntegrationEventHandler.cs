using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AuthApi.Entities;
using AuthApi.Infrastructure.Services;
using AuthApi.IntegrationEvents.Events;
using MediatR;
using Microsoft.Extensions.Logging;
using SecureChat.Common.Events.EventBus.Abstractions;

namespace AuthApi.IntegrationEvents.EventHandling
{
    public class PermissionsRemovedIntegrationEventHandler : IIntegrationEventHandler<PermissionsRemovedIntegrationEvent>
    {
        private readonly IClaimService _claimService;
        private readonly ILogger<PermissionsAddedIntegrationEventHandler> _logger;

        public PermissionsRemovedIntegrationEventHandler(IClaimService claimService, ILogger<PermissionsAddedIntegrationEventHandler> logger)
        {
            _claimService = claimService;
            _logger = logger;
        }

        public async Task Handle(PermissionsRemovedIntegrationEvent integrationEvent)
        {
            _logger.LogInformation($"----- Handling integration event: {integrationEvent.Id} at {nameof(PermissionsRemovedIntegrationEventHandler)} - ({integrationEvent})");

            var claims = integrationEvent.Permissions
                .Select(perm => new Claim(integrationEvent.PersonId, "Permission", perm))
                .ToList();

            foreach (var claim in claims)
            {
                var result = await _claimService.RemoveClaim(claim);
                if (result)
                {
                    _logger.LogInformation($"----- Removed claim: {claim.Type}, {claim.Value} for {integrationEvent.PersonId}");
                }
                else
                {
                    _logger.LogInformation($"----- Could not remove claim: {claim.Type}, {claim.Value} for {integrationEvent.PersonId}");
                }
            }
        }
    }
}
