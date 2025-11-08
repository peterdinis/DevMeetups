using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Meetups.Queries;
using Application.Meetups.Commands;

namespace API.Controllers;

public class MeetupsController : BaseApiController
{
    private readonly GetMeetupListHandler _getMeetupListHandler;
    private readonly GetMeetupDetailsHandler _getMeetupDetailsHandler;
    private readonly CreateMeetupHandler _createMeetupHandler;
    private readonly EditMeetupHandler _editMeetupHandler;
    private readonly DeleteMeetupHandler _deleteMeetupHandler;

    public MeetupsController(
        GetMeetupListHandler getMeetupListHandler,
        GetMeetupDetailsHandler getMeetupDetailsHandler,
        CreateMeetupHandler createMeetupHandler,
        EditMeetupHandler editMeetupHandler,
        DeleteMeetupHandler deleteMeetupHandler)
    {
        _getMeetupListHandler = getMeetupListHandler;
        _getMeetupDetailsHandler = getMeetupDetailsHandler;
        _createMeetupHandler = createMeetupHandler;
        _editMeetupHandler = editMeetupHandler;
        _deleteMeetupHandler = deleteMeetupHandler;
    }

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
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost]
    public async Task<ActionResult<string>> CreateMeetup(CreateMeetupCommand command)
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
    public async Task<ActionResult> EditMeetup(string id, EditMeetupCommand command)
    {
        try
        {
            command.Id = id;
            await _editMeetupHandler.Handle(command);
            return NoContent();
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
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
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }
}