using Persistence;

namespace Application.Meetups.Commands
{
    public class DeleteMeetupService(AppDbContext context)
    {
        private readonly AppDbContext _context = context;

        public async Task DeleteMeetupAsync(string id, CancellationToken cancellationToken = default)
        {
            var meetup = await _context.Meetups
                .FindAsync([id], cancellationToken) 
                    ?? throw new Exception($"Meetup with ID {id} not found");

            _context.Meetups.Remove(meetup);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}