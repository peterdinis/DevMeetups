using Domain;
using Persistence;
using System;

namespace Application.Meetups.Queries
{
    public class GetMeetupDetailsService(AppDbContext context)
    {
        private readonly AppDbContext _context = context;

        public async Task<Meetup> GetMeetupByIdAsync(string id, CancellationToken cancellationToken = default)
        {
            var meetup = await _context.Meetups.FindAsync([id], cancellationToken) 
                ?? throw new Exception($"Meetup with ID {id} not found");
            
            return meetup;
        }
    }
}