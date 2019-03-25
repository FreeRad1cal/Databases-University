using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Personnel.Api.Application.Commands;
using Personnel.Api.Application.Queries;
using Personnel.Api.Dtos;
using Personnel.Api.Infrastructure.Services;
using Personnel.Api.Models;

namespace Personnel.Api.Controllers
{
    [Route("people")]
    [Authorize]
    public class PeopleController : Controller
    {
        private readonly IIdentityService _identityService;
        private readonly ILogger<PeopleController> _logger;
        private readonly IPersonQueries _personQueries;
        private readonly IMediator _mediator;

        public PeopleController(
            IIdentityService identityService, 
            ILogger<PeopleController> logger,
            IPersonQueries personQueries,
            IMediator mediator)
        {
            _identityService = identityService;
            _logger = logger;
            _personQueries = personQueries;
            _mediator = mediator;
        }

        [HttpPost("", Name = nameof(RegisterUser))]
        [AllowAnonymous]
        public async Task<ActionResult<PersonDto>> RegisterUser([FromBody] RegisterPersonCommand registerPersonCommand)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ErrorResponse(ModelState));
            }

            var user = await _mediator.Send(registerPersonCommand);
            return Created(Url.Action(nameof(GetUserByIdAsync), new {id = user.Id}), user);
        }

        [HttpGet("me", Name = nameof(GetMeAsync))]
        public async Task<ActionResult<PersonDto>> GetMeAsync()
        {
            var myId = _identityService.GetUserIdentity();
            var person = await _personQueries.GetPersonByIdAsync(myId);
            return Ok(person);
        }

        [HttpGet("{id}", Name = nameof(GetUserByIdAsync))]
        public async Task<ActionResult<PersonDto>> GetUserByIdAsync([FromRoute] int id)
        {
            var myId = _identityService.GetUserIdentity();
            if (myId != id)
            {
                return Unauthorized();
            }

            var person = await _personQueries.GetPersonByIdAsync(id);
            if (person == null)
            {
                return NotFound();
            }

            return Ok(person);
        }
    }
}
