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
    public class PermissionsAddedIntegrationEventHandler : IIntegrationEventHandler<PermissionsAddedIntegrationEvent>
    {
        private readonly IClaimService _claimService;
        private readonly ILogger<PermissionsAddedIntegrationEventHandler> _logger;

        public PermissionsAddedIntegrationEventHandler(IClaimService claimService, ILogger<PermissionsAddedIntegrationEventHandler> logger)
        {
            _claimService = claimService;
            _logger = logger;
        }

        public async Task Handle(PermissionsAddedIntegrationEvent integrationEvent)
        {
            _logger.LogInformation($"----- Handling integration event: {integrationEvent.Id} at {nameof(PermissionsAddedIntegrationEventHandler)} - ({integrationEvent})");

            var claims = integrationEvent.Permissions
                .Select(perm => new Claim(integrationEvent.PersonId, "Permission", perm))
                .ToList();

            foreach (var claim in claims)
            {
                var result = await _claimService.AddClaim(claim);
                if (result)
                {
                    _logger.LogInformation($"----- Added claim: {claim.Type}, {claim.Value} for {integrationEvent.PersonId}");
                }
                else
                {
                    _logger.LogInformation($"----- Could not add claim: {claim.Type}, {claim.Value} for {integrationEvent.PersonId}");
                }
            }
        }
    }
}