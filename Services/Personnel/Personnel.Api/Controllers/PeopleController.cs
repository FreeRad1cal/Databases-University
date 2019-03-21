using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Personnel.Api.Application.Queries;
using Personnel.Api.Infrastructure.Services;

namespace Personnel.Api.Controllers
{
    [Route("people")]
    [ApiController]
    public class PeopleController : ControllerBase
    {
        private readonly IIdentityService _identityService;
        private readonly ILogger<PeopleController> _logger;
        private readonly IPersonQueries _personQueries;

        public PeopleController(
            IIdentityService identityService, 
            ILogger<PeopleController> logger,
            IPersonQueries personQueries)
        {
            _identityService = identityService;
            _logger = logger;
            _personQueries = personQueries;
        }

        public async Task<IActionResult> GetMeAsync(CancellationToken ct = default(CancellationToken))
        {
            var id = _identityService.GetUserIdentity();
            var person = await _personQueries.GetPersonByIdAsync(id);
            return Ok(person);
        }
    }
}
