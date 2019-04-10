using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;

namespace Personnel.Api.Application.Commands
{
    public class DeleteJobApplicationCommand : INotification
    {
        public int Id { get; }

        public DeleteJobApplicationCommand(int id)
        {
            Id = id;
        }
    }
}
