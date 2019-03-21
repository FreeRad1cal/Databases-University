using System.Collections.Generic;

namespace Personnel.Api.Models
{
    public class ErrorResponse
    {
        public IEnumerable<string> Errors { get; set; }

        public ErrorResponse(IEnumerable<string> errors = null)
        {
            Errors = errors;
        }
    }
}
