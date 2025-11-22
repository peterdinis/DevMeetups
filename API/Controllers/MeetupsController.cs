using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Meetups.Queries;
using Application.Meetups.Commands;
using Application.Validators;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MeetupsController(
        GetMeetupListHandler getMeetupListHandler,
        GetMeetupDetailsHandler getMeetupDetailsHandler,
        CreateMeetupHandler createMeetupHandler,
        EditMeetupHandler editMeetupHandler,
        DeleteMeetupHandler deleteMeetupHandler) : ControllerBase
    {
        private readonly GetMeetupListHandler _getMeetupListHandler = getMeetupListHandler;
        private readonly GetMeetupDetailsHandler _getMeetupDetailsHandler = getMeetupDetailsHandler;
        private readonly CreateMeetupHandler _createMeetupHandler = createMeetupHandler;
        private readonly EditMeetupHandler _editMeetupHandler = editMeetupHandler;
        private readonly DeleteMeetupHandler _deleteMeetupHandler = deleteMeetupHandler;

        [HttpGet]
        public async Task<ActionResult<List<Meetup>>> GetMeetups()
        {
            var query = new GetMeetupListQuery();
            var result = await _getMeetupListHandler.Handle(query);
            
            return HandleResult(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Meetup>> GetMeetupDetail(string id)
        {
            var query = new GetMeetupDetailsQuery { Id = id };
            var result = await _getMeetupDetailsHandler.Handle(query);
            
            return HandleResult(result);
        }
        
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<string>> CreateMeetup([FromBody] CreateMeetupCommand command)
        {
            var result = await _createMeetupHandler.Handle(command);
            
            if (result.IsSuccess)
            {
                return CreatedAtAction(nameof(GetMeetupDetail), new { id = result.Value }, new { id = result.Value });
            }
            
            return HandleResult(result);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult> EditMeetup(string id, [FromBody] EditMeetupCommand command)
        {
            command.Id = id;
            var result = await _editMeetupHandler.Handle(command);
            
            return HandleResult(result);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMeetup(string id)
        {
            var command = new DeleteMeetupCommand { Id = id };
            var result = await _deleteMeetupHandler.Handle(command);
            
            return HandleResult(result);
        }

        private ActionResult HandleResult(Result result)
        {
            if (result.IsSuccess)
            {
                return NoContent();
            }

            return MapErrorToActionResult(result.Error);
        }

        private ActionResult<T> HandleResult<T>(Result<T> result)
        {
            if (result.IsSuccess)
            {
                return Ok(result.Value);
            }

            return MapErrorToActionResult<T>(result.Error);
        }

        private ActionResult MapErrorToActionResult(string error)
        {
            return error.ToLower() switch
            {
                var e when e.Contains("not found") => NotFound(error),
                var e when e.Contains("required") || e.Contains("invalid") || e.Contains("cannot exceed") => BadRequest(error),
                var e when e.Contains("already occurred") || e.Contains("cancelled") || e.Contains("future") => BadRequest(error),
                _ => StatusCode(500, "An internal server error occurred. Please try again later.")
            };
        }

        private ActionResult<T> MapErrorToActionResult<T>(string error)
        {
            var actionResult = MapErrorToActionResult(error);
            return actionResult as ActionResult<T> ?? new ObjectResult(error) { StatusCode = (actionResult as ObjectResult)?.StatusCode };
        }
    }
}