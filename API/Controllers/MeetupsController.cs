using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Meetups.Queries;

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
        return await Mediator.Send(new GetMeetupDetails.Query{Id = id});
    }
}