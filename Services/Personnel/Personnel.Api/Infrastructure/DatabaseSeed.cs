using System;
using System.Data.SqlClient;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using Personnel.Api.Application.Commands;
using Personnel.Api.Dtos;
using Personnel.Domain.AggregateModel.JobPostingAggregate;
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
            var tasks = new[] { SeedJobPosting(), SeedPerson()};
            await Task.WhenAll(tasks);
        }

        private async Task SeedPerson()
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

                var policy = CreatePolicy(_logger, nameof(SeedPerson));
                await policy.ExecuteAsync(async () =>
                {
                    var result = await _mediator.Send(command);
                    var hireCommand = new HirePersonCommand(result.Id, new JobTitleDto() { Name = "Database Administrator" });
                    await _mediator.Publish(hireCommand);
                });
            }
            catch (PersonnelDomainException e)
            {
                _logger.LogError(e.Message);
            };
        }

        private async Task SeedJobPosting()
        {
            try
            {
                var command = new CreateJobPostingCommand()
                {
                    JobTitle = "Database Administrator",
                    Description = "Manage databases"
                };

                var policy = CreatePolicy(_logger, nameof(SeedJobPosting));
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

        private AsyncRetryPolicy CreatePolicy(ILogger logger, string prefix, int retries = 6)
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
