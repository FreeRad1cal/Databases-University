using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SecureChat.Common.Events.EventBus.Events;

namespace Personnel.Api.Application.IntegrationEvents
{
    public class JobApplicationSubmittedIntegrationEvent : IntegrationEvent
    {
        public string JobApplicationId { get; }

        public JobApplicationSubmittedIntegrationEvent(string jobApplicationId)
        {
            JobApplicationId = jobApplicationId;
        }
    }
}
