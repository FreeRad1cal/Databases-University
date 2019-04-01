using System;
using System.Data.SqlClient;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using Personnel.Api.Application.Commands;
using Personnel.Api.Dtos;
using Personnel.Domain.Exceptions;
using Polly;
using Polly.Retry;

namespace Personnel.Api.Infrastructure
{
    public class DatabaseSeed
    {
        private readonly IMediator _mediator;
        private readonly ILogger<DatabaseSeed> _logger;

        public DatabaseSeed(IMediator mediator, ILogger<DatabaseSeed> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            try
            {
                var command = new RegisterPersonCommand()
                {
                    UserName = "superuser",
                    Password = "superuser12345",
                    EmailAddress = "email@email.com",
                    FirstName = "John",
                    LastName = "Doe",
                    HomeAddress = new AddressDto()
                    {
                        City = "New York",
                        Country = "US",
                        Street = "160 Convent Ave.",
                        ZipCode = "18064",
                        State = "New York"
                    },
                    MailingAddress = new AddressDto()
                    {
                        City = "New York",
                        Country = "US",
                        Street = "161 Convent Ave.",
                        ZipCode = "18064",
                        State = "New York"
                    }
                };

                var policy = CreatePolicy(_logger, nameof(DatabaseSeed));
                await policy.ExecuteAsync(async () =>
                {
                    await _mediator.Send(command);
                });
            }
            catch (PersonnelDomainException e)
            {
                _logger.LogError(e.Message);
            };
        }

        private AsyncRetryPolicy CreatePolicy(ILogger logger, string prefix, int retries = 3)
        {
            return Policy.Handle<SqlException>().
                WaitAndRetryAsync(
                    retryCount: retries, 
                    sleepDurationProvider: retry => TimeSpan.FromSeconds(5), 
                    onRetry: (exception, timeSpan, retry, ctx) =>
                    {
                        logger.LogTrace($"[{prefix}] Exception {exception.GetType().Name} with message ${exception.Message} detected on attempt {retry} of {retries}");
                    });
        }
    }
}
