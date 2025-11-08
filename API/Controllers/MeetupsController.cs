using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Meetups.Queries;
using Application.Meetups.Commands;

namespace API.Controllers;

public class MeetupsController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Meetup>>> GetMeetups()
    {
         return await Mediator.Send(new GetMeetupList.Query());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Meetup>> GetMeetupDetail(string id)
    {
        return await Mediator.Send(new GetMeetupDetails.Query { Id = id });
    }
    
    [HttpPost]
    public async Task<ActionResult<string>> CreateMeetup(Meetup meetup)
    {
        return await Mediator.Send(new CreateMeetup.Command{Meetup = meetup});
    }

    [HttpPut]
    public async Task<ActionResult> EditMeetup(Meetup meetup)
    {
        await Mediator.Send(new EditMeetup.Command{Meetup = meetup});

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMeetup(string id)
    {
        await Mediator.Send(new DeleteMeetup.Command{Id = id});

        return Ok();
    }
}