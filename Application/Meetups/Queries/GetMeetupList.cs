using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Meetups.Queries
{
    public class GetMeetupListQuery
    {
        
    }

    public class GetMeetupListHandler(AppDbContext context)
    {
        private readonly AppDbContext _context = context ?? throw new ArgumentNullException(nameof(context));

        public async Task<List<Meetup>> Handle(GetMeetupListQuery request, CancellationToken cancellationToken = default)
        {
            return await _context.Meetups.ToListAsync(cancellationToken);
        }
    }
}