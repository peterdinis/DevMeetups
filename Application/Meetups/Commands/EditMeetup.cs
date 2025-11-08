using Domain;
using Persistence;

namespace Application.Meetups.Commands
{
    public class EditMeetupCommand
    {
        public required Meetup Meetup { get; set; }
    }

    public class EditMeetupHandler(AppDbContext context)
    {
        private readonly AppDbContext _context = context ?? throw new ArgumentNullException(nameof(context));

        public async Task Handle(EditMeetupCommand request, CancellationToken cancellationToken = default)
        {
            var meetup = await _context.Meetups
                .FindAsync([request.Meetup.Id], cancellationToken) 
                    ?? throw new Exception("Cannot find meetup");

            // Manual mapping of properties
            meetup.Title = request.Meetup.Title;
            meetup.Description = request.Meetup.Description;
            meetup.Date = request.Meetup.Date;
            meetup.Category = request.Meetup.Category;
            meetup.City = request.Meetup.City;
            meetup.Venue = request.Meetup.Venue;
            meetup.Latitude = request.Meetup.Latitude;
            meetup.Longitude = request.Meetup.Longitude;
            // IsCancelled is intentionally not updated here to prevent accidental cancellation via edit

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}