using System.Linq;
using AutoMapper;
using DatabasesUniversity.Common.Events.EventBus;
using DatabasesUniversity.Common.Events.EventBus.Abstractions;
using DatabasesUniversity.Common.Events.EventBusRabbitMQ;
using FluentValidation.AspNetCore;
using HealthChecks.UI.Client;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Personnel.Api.Dtos;
using Personnel.Api.Infrastructure;
using Personnel.Api.Infrastructure.HealthChecks;
using Personnel.Api.Infrastructure.Services;
using Personnel.Domain.PersonAggregate;
using Personnel.Infrastructure.Repositories;
using Helpers.Extensions;
using Personnel.Api.Application.Queries;

namespace Personnel.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc(options =>
            {
                // Require authentication by default
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
                options.Filters.Add(new AuthorizeFilter(policy));
            })
            .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<Startup>());

            services.Configure<PersonnelApiSettings>(Configuration);

            services.AddMediatR(typeof(Startup).Assembly);

            services.AddTransient<IHttpContextAccessor, HttpContextAccessor>();
            services.AddTransient<IIdentityService, IdentityService>();

            services.AddScoped<IPersonRepository, PersonRepository>();
            services.AddTransient<IPersonQueries, PersonQueries>();

            services.AddScoped<DatabaseSeed>();

            services.AddAutoMapper(cfg =>
            {
                cfg.CreateMap<AddressDto, Address>();
                cfg.CreateMap<Address, AddressDto>();
                cfg.CreateMap<Person, PersonDto>();
            });

            services.AddEventBus(Configuration);

            services.AddHealthChecks()
                .AddCheck("self-check", () => HealthCheckResult.Healthy())
                .AddCheck("db-check", new SqlConnectionHealthCheck(Configuration["ConnectionString"]));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHealthChecks("/hc", new HealthCheckOptions
            {
                Predicate = r => r.Name.Contains("self"),
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
            });

            app.UseHealthChecks("/readiness", new HealthCheckOptions
            {
                Predicate = r => r.Name.Contains("db-check"),
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
            });

            app.UseMvc();
        }    
    }

    internal static class CustomExtensionMethods
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
                options.QueueName = typeof(Startup).Assembly.GetName().Name;
            });

            services.AddSingleton<IEventBus, EventBusRabbitMQ>();
            services.AddSingleton<IEventBusSubscriptionsManager, InMemoryEventBusSubscriptionsManager>();

            return services;
        }

        //public static IServiceCollection AddMediator(this IServiceCollection services)
        //{
        //    services.AddMediatR();

        //    foreach (var handlerInterface in new[] {typeof(IRequestHandler<,>), typeof(INotificationHandler<>)})
        //    {
        //        var handlers = typeof(Startup).Assembly.GetTypes()
        //            .Where(type => type.ImplementsGenericInterface(handlerInterface));
        //        foreach (var handler in handlers)
        //        {
        //            services.AddTransient(handlerInterface, handler);
        //        }
        //    }

        //    return services;
        //}
    }
}
