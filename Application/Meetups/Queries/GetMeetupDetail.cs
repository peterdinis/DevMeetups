using Domain;
using Persistence;

namespace Application.Meetups.Queries
{
    public class GetMeetupDetailsHandler
    {
        private readonly AppDbContext _context;

        public GetMeetupDetailsHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Meetup> Handle(GetMeetupDetailsQuery query, CancellationToken cancellationToken = default)
        {
            var meetup = await _context.Meetups.FindAsync([query.Id], cancellationToken);

            if (meetup is null)
                throw new KeyNotFoundException($"Meetup with ID '{query.Id}' not found.");

            return meetup;
        }
    }

    public class GetMeetupDetailsQuery
    {
        public string Id { get; set; } = default!;
    }
}
