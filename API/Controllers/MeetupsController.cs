using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

public class MeetupsController(AppDbContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Meetup>>> GetMeetups()
    {
        return await context.Meetups.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Meetup>> GetMeetupDetail(string id)
    {
        var Meetup = await context.Meetups.FindAsync(id);

        if (Meetup == null) return NotFound();

        return Meetup;
    }
}