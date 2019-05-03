using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using Personnel.Domain.AggregateModel.JobApplicationAggregate;

namespace Personnel.Api.Application.Commands
{
    public class DeleteJobApplicationCommandHandler : INotificationHandler<DeleteJobApplicationCommand>
    {
        private readonly ILogger<DeleteJobApplicationCommandHandler> _logger;
        private readonly IJobApplicationRepository _jobApplicationRepository;

        public DeleteJobApplicationCommandHandler(
            ILogger<DeleteJobApplicationCommandHandler> logger, 
            IJobApplicationRepository jobApplicationRepository)
        {
            _logger = logger;
            _jobApplicationRepository = jobApplicationRepository;
        }

        public async Task Handle(DeleteJobApplicationCommand request, CancellationToken cancellationToken)
        {
            var appl = await _jobApplicationRepository.GetAsync(request.Id);
            _jobApplicationRepository.Delete(appl);
            await _jobApplicationRepository.UnitOfWork.SaveChangesAsync();
            _logger.LogInformation("----- Deleted job application: {@Id}", request.Id);
        }
    }
}
