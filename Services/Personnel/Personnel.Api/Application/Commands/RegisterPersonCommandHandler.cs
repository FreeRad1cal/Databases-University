using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Personnel.Api.Dtos;
using Personnel.Domain.PersonAggregate;
using Helpers;
using Microsoft.Extensions.Logging;
using Personnel.Api.Application.Queries;
using Personnel.Domain.Exceptions;
using SecureChat.Common.Events.EventBus.Abstractions;

namespace Personnel.Api.Application.Commands
{
    public class RegisterPersonCommandHandler : IRequestHandler<RegisterPersonCommand, PersonDto>
    {
        private readonly IPersonRepository _personRepository;
        private readonly IMediator _mediator;
        private readonly IEventBus _eventBus;
        private readonly IMapper _mapper;
        private readonly IPersonQueries _personQueries;
        private readonly ILogger<RegisterPersonCommandHandler> _logger;

        public RegisterPersonCommandHandler(
            IPersonRepository personRepository,
            IMediator mediator,
            IEventBus eventBus,
            IMapper mapper,
            IPersonQueries personQueries,
            ILogger<RegisterPersonCommandHandler> logger)
        {
            _personRepository = personRepository;
            _mediator = mediator;
            _eventBus = eventBus;
            _mapper = mapper;
            _personQueries = personQueries;
            _logger = logger;
        }

        public async Task<PersonDto> Handle(RegisterPersonCommand request, CancellationToken cancellationToken)
        {
            if (await _personQueries.UserNameOrEmailExists(request.UserName, request.EmailAddress))
            {
                throw new PersonnelDomainException(ErrorTypes.RegistrationError, new[] { "A user with this username or email address already exists" });
            }

            var person = new Person(request.UserName, request.EmailAddress, request.FirstName, request.LastName,
                _mapper.Map<Address>(request.HomeAddress),
                _mapper.Map<Address>(request.MailingAddress));

            var saltHash = SaltedHashHelper.GenerateSaltedHash(8, request.Password);
            var result = _personRepository.Add(person, saltHash.Salt, saltHash.Hash);
            await _personRepository.SaveChangesAsync();

            return _mapper.Map<PersonDto>(result);
        }
    }
}
