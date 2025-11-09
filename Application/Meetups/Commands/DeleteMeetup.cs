using Persistence;

namespace Application.Meetups.Commands
{
    public class DeleteMeetupHandler(AppDbContext context)
    {
        private readonly AppDbContext _context = context;

        public async Task Handle(DeleteMeetupCommand command, CancellationToken cancellationToken = default)
        {
            var meetup = await _context.Meetups.FindAsync(command.Id, cancellationToken);

            if (meetup is null)
                throw new KeyNotFoundException($"Meetup with ID '{command.Id}' not found.");

            _context.Meetups.Remove(meetup);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public class DeleteMeetupCommand
    {
        public string Id { get; set; } = default!;
    }
}
