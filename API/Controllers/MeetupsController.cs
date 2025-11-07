using Domain;
using Microsoft.AspNetCore.Mvc;
using Persistence;
using Application.Meetups.Queries;

namespace API.Controllers;

public class MeetupsController(AppDbContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Meetup>>> GetMeetups()
    {
         return await Mediator.Send(new GetMeetupList.Query());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Meetup>> GetMeetupDetail(string id)
    {
        var Meetup = await context.Meetups.FindAsync(id);

        if (Meetup == null) return NotFound();

        return Meetup;
    }
}