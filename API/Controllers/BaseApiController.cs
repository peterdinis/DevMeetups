using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
        
        protected ActionResult<T> OkOrNotFound<T>(T? result, string notFoundMessage = "Resource not found")
        {
            return result is null ? NotFound(notFoundMessage) : Ok(result);
        }
        
        protected ActionResult<T> CreatedWithId<T>(string actionName, T id, object? value = null)
        {
            return CreatedAtAction(actionName, new { id }, value ?? new { id });
        }
        
        protected ActionResult<T> BadRequestWithError<T>(string errorMessage)
        {
            return BadRequest(new { error = errorMessage });
        }
        
        protected ActionResult<T> ValidationProblem<T>(string errorMessage)
        {
            ModelState.AddModelError(string.Empty, errorMessage);
            return ValidationProblem();
        }
    }
}