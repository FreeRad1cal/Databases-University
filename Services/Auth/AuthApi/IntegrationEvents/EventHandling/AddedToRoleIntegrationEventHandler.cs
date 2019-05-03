using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AuthApi.Infrastructure.Services;
using AuthApi.IntegrationEvents.Events;
using Microsoft.Extensions.Logging;
using SecureChat.Common.Events.EventBus.Abstractions;
using Claim = AuthApi.Entities.Claim;

namespace AuthApi.IntegrationEvents.EventHandling
{
    public class AddedToRoleIntegrationEventHandler : IIntegrationEventHandler<AddedToRoleIntegrationEvent>
    {
        private readonly IClaimService _claimService;
        private readonly ILogger<AddedToRoleIntegrationEventHandler> _logger;

        public AddedToRoleIntegrationEventHandler (IClaimService claimService, ILogger<AddedToRoleIntegrationEventHandler> logger)
        {
            _claimService = claimService;
            _logger = logger;
        }

        public async Task Handle(AddedToRoleIntegrationEvent integrationEvent)
        {
            _logger.LogInformation($"----- Handling integration event: {integrationEvent.Id} at {nameof(AddedToRoleIntegrationEventHandler)} - ({integrationEvent})");

            var claim = new Claim(integrationEvent.PersonId, type: ClaimTypes.Role, value: integrationEvent.Role);
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
