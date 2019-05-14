using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AuthApi.Infrastructure.HealthChecks;
using AuthApi.Infrastructure.Services;
using AuthApi.IntegrationEvents.EventHandling;
using AuthApi.IntegrationEvents.Events;
using HealthChecks.UI.Client;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using SecureChat.Common.Events.EventBus;
using SecureChat.Common.Events.EventBus.Abstractions;
using SecureChat.Common.Events.EventBusRabbitMQ;
using SecureChat.Common.Events.EventBusRabbitMQ.Extensions;

namespace AuthApi
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
            services
                .AddMvc()
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore; 

                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.Configure<AuthApiSettings>(Configuration);

            services.AddHealthChecks()
                .AddCheck("self-check", () => HealthCheckResult.Healthy())
                .AddCheck("db-check", new SqlConnectionHealthCheck(Configuration["ConnectionString"]));

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder
                        .WithOrigins(Configuration["AngularSpa"])
                        .AllowAnyMethod()
                        .AllowAnyHeader());
            });

            services.AddTransient<ITokenService, DefaultTokenService>();
            services.AddTransient<IClaimService, DefaultClaimService>();
            services.AddTransient<IUserService, DefaultUserService>();

            services.AddEventBus(Configuration, GetType().Assembly);
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.ConfigureEventBus();

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

            app.UseCors("CorsPolicy");

            app.UseMvc();
        }
    }

    internal static class CustomExtensionMethods
    {
        public static IApplicationBuilder ConfigureEventBus(this IApplicationBuilder app)
        {
            var eventBus = app.ApplicationServices.GetRequiredService<IEventBus>();
            eventBus.Subscribe<AddedToRoleIntegrationEvent, AddedToRoleIntegrationEventHandler>();
            eventBus.Subscribe<RemovedFromRoleIntegrationEvent, RemovedFromRoleIntegrationEventHandler>();
            eventBus.Subscribe<PersonRegisteredIntegrationEvent, PersonRegisteredIntegrationEventHandler>();

            return app;
        }
    }
}
