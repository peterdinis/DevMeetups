using Domain;
using Persistence;

namespace Application.Meetups.Commands
{
    public class EditMeetupCommand
    {
        public string Id { get; set; } = default!;
        public required Meetup Meetup { get; set; }
    }

    public class EditMeetupHandler(AppDbContext context)
    {
        private readonly AppDbContext _context = context ?? throw new ArgumentNullException(nameof(context));

        public async Task Handle(EditMeetupCommand request, CancellationToken cancellationToken = default)
        {
            var meetup = await _context.Meetups.FindAsync(request.Id, cancellationToken)
                ?? throw new KeyNotFoundException($"Cannot find meetup with ID '{request.Id}'.");

            meetup.Title = request.Meetup.Title;
            meetup.Description = request.Meetup.Description;
            meetup.Date = request.Meetup.Date;
            meetup.Category = request.Meetup.Category;
            meetup.City = request.Meetup.City;
            meetup.Venue = request.Meetup.Venue;
            meetup.Latitude = request.Meetup.Latitude;
            meetup.Longitude = request.Meetup.Longitude;
            // IsCancelled neaktualizujeme úmyselne

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
