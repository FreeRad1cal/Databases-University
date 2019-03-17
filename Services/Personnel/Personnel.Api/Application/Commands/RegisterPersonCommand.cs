using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Personnel.Api.Entities;

namespace Personnel.Api.Application.Commands
{
    public class RegisterPersonCommand : IRequest<Person>
    {

    }
}
