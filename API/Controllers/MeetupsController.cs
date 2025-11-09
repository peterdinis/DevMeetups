using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Meetups.Queries;
using Application.Meetups.Commands;

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
            var meetups = await _getMeetupListHandler.Handle(query);
            return Ok(meetups);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Meetup>> GetMeetupDetail(string id)
        {
            try
            {
                var query = new GetMeetupDetailsQuery { Id = id };
                var meetup = await _getMeetupDetailsHandler.Handle(query);
                return Ok(meetup);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<string>> CreateMeetup([FromBody] CreateMeetupCommand command)
        {
            try
            {
                var meetupId = await _createMeetupHandler.Handle(command);
                return CreatedAtAction(nameof(GetMeetupDetail), new { id = meetupId }, new { id = meetupId });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> EditMeetup(string id, [FromBody] EditMeetupCommand command)
        {
            try
            {
                command.Id = id;
                await _editMeetupHandler.Handle(command);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMeetup(string id)
        {
            try
            {
                var command = new DeleteMeetupCommand { Id = id };
                await _deleteMeetupHandler.Handle(command);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
