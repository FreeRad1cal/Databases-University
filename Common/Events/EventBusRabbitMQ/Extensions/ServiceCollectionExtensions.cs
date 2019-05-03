using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using Helpers.Extensions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SecureChat.Common.Events.EventBus;
using SecureChat.Common.Events.EventBus.Abstractions;

namespace SecureChat.Common.Events.EventBusRabbitMQ.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddEventBus(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IRabbitMQPersistentConnection, DefaultRabbitMQPersistentConnection>();
            services.AddSingleton<IEventBusSubscriptionsManager, InMemoryEventBusSubscriptionsManager>();
            services.Configure<EventBusOptions>(options =>
            {
                options.HostName = configuration["EventBusConnection"];
                options.UserName = configuration["EventBusUserName"];
                options.Password = configuration["EventBusPassword"];
                options.QueueName = configuration["EventBusQueueName"];
            });

            services.AddSingleton<IEventBus, EventBusRabbitMQ>();
            services.AddSingleton<IEventBusSubscriptionsManager, InMemoryEventBusSubscriptionsManager>();

            var concreteTypes = Assembly.GetCallingAssembly().GetTypes()
                .Where(type => type.ImplementsGenericInterface(typeof(IIntegrationEventHandler<>)) 
                               || type.GetInterfaces(true).Contains(typeof(IDynamicIntegrationEventHandler)));
            foreach (var concreteType in concreteTypes)
            {
                services.AddTransient(concreteType);
            }

            return services;
        }
    }
}
