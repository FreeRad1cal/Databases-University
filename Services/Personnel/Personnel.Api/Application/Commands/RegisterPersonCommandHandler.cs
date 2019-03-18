﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Personnel.Api.Dtos;
using Personnel.Domain.PersonAggregate;
using DatabasesUniversity.Common.Events.EventBus.Abstractions;
using Helpers;

namespace Personnel.Api.Application.Commands
{
    public class RegisterPersonCommandHandler : IRequestHandler<RegisterPersonCommand, PersonDto>
    {
        private readonly IPersonRepository _personRepository;
        private readonly IMediator _mediator;
        private readonly IEventBus _eventBus;
        private readonly IMapper _mapper;

        public RegisterPersonCommandHandler(
            IPersonRepository personRepository,
            IMediator mediator,
            IEventBus eventBus,
            IMapper mapper)
        {
            _personRepository = personRepository;
            _mediator = mediator;
            _eventBus = eventBus;
            _mapper = mapper;
        }

        public async Task<PersonDto> Handle(RegisterPersonCommand request, CancellationToken cancellationToken)
        {
            var person = new Person(request.UserName, request.EmailAddress,
                _mapper.Map<Address>(request.HomeAddress),
                _mapper.Map<Address>(request.MailingAddress));

            var saltHash = SaltedHashHelper.GenerateSaltedHash(4, request.Password);
            var result = _personRepository.Add(person, saltHash.Salt, saltHash.Hash);
            await _personRepository.UnitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<PersonDto>(result);
        }
    }
}