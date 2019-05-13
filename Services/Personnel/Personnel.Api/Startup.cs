using System;
using System.IO;
using System.Linq;
using System.Text;
using AutoMapper;
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
using Personnel.Infrastructure.Repositories;
using Helpers.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Personnel.Api.Application.Queries;
using Personnel.Api.Infrastructure.Filters;
using Personnel.Domain.AggregateModel.JobApplicationAggregate;
using Personnel.Domain.AggregateModel.JobPostingAggregate;
using Personnel.Domain.AggregateModel.PersonAggregate;
using Personnel.Domain.Common;
using Personnel.Infrastructure;
using Personnel.Infrastructure.Services;
using Personnel.Infrastructure.UnitOfWork;
using SecureChat.Common.Events.EventBus;
using SecureChat.Common.Events.EventBus.Abstractions;
using SecureChat.Common.Events.EventBusRabbitMQ;
using SecureChat.Common.Events.EventBusRabbitMQ.Extensions;

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
                options.Filters.Add(typeof(GlobalExceptionFilter));
            })
            .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<Startup>())
            .AddJsonOptions(options =>
            {
                options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
            });

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder
                        .WithOrigins(Configuration["AngularSpa"])
                        .AllowAnyMethod()
                        .AllowAnyHeader());
            });

            services.AddAuthentication(Configuration);

            services.Configure<PersonnelApiSettings>(Configuration);
            services.Configure<DbConnectionInfo>(Configuration);

            services.AddMediatR(typeof(Startup).Assembly);

            services.AddScoped<IUnitOfWork, SqlUnitOfWork>();

            services.AddScoped<IDbConnectionFactory, MySqlConnectionFactory>();
            services.AddTransient<IResumePersisterService, ResumePersisterService>();

            services.AddTransient<IHttpContextAccessor, HttpContextAccessor>();
            services.AddTransient<IIdentityService, IdentityService>();

            services.AddScoped<IPersonRepository, PersonRepository>();
            services.AddTransient<IPersonQueries, PersonQueries>();

            services.AddScoped<IJobPostingRepository, JobPostingRepository>();
            services.AddTransient<IEmploymentQueries, EmploymentQueries>();

            services.AddScoped<IJobApplicationRepository, JobApplicationRepository>();

            services.AddScoped<DatabaseSeed>();

            services.AddAutoMapper(cfg =>
            {
                cfg.CreateMap<AddressDto, Address>();
                cfg.CreateMap<Address, AddressDto>();
                cfg.CreateMap<Person, PersonDto>();
                cfg.CreateMap<JobPosting, JobPostingDto>();
                cfg.CreateMap<JobTitle, JobTitleDto>();
                cfg.CreateMap<JobTitleDto, JobTitle>();
                cfg.CreateMap<JobApplication, JobApplicationDto>();
            });

            services.AddEventBus(Configuration, GetType().Assembly);

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

            app.UseCors("CorsPolicy");

            app.UseAuthentication();

            app.UseMvc();
        }    
    }

    internal static class CustomExtensionMethods
    {
        public static IServiceCollection AddAuthentication(this IServiceCollection services,
            IConfiguration configuration)
        {
            var tokenValidationParameters = new TokenValidationParameters()
            {
                RequireExpirationTime = false,
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration["Secret"])),
            };

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = tokenValidationParameters;
                    options.SaveToken = true;
                });

            return services;
        }
    }
}
