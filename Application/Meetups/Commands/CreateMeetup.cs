using Domain;
using Persistence;

namespace Application.Meetups.Commands
{
    public record CreateMeetupCommand(
        string Title,
        string Description,
        DateTime Date,
        string Category,
        string City,
        string Venue,
        double Latitude = 0,
        double Longitude = 0
    );

    public class CreateMeetupHandler(AppDbContext context)
    {
        private readonly AppDbContext _context = context ?? throw new ArgumentNullException(nameof(context));

        public async Task<string> Handle(CreateMeetupCommand request, CancellationToken cancellationToken = default)
        {
            // Input validation
            if (string.IsNullOrWhiteSpace(request.Title))
                throw new ArgumentException("Title is required", nameof(request.Title));

            if (string.IsNullOrWhiteSpace(request.Description))
                throw new ArgumentException("Description is required", nameof(request.Description));

            if (string.IsNullOrWhiteSpace(request.Category))
                throw new ArgumentException("Category is required", nameof(request.Category));

            if (string.IsNullOrWhiteSpace(request.City))
                throw new ArgumentException("City is required", nameof(request.City));

            if (string.IsNullOrWhiteSpace(request.Venue))
                throw new ArgumentException("Venue is required", nameof(request.Venue));

            // Create Meetup entity with all required properties
            var meetup = new Meetup
            {
                // Id is auto-generated in the domain model
                Title = request.Title,
                Description = request.Description,
                Date = request.Date,
                Category = request.Category,
                City = request.City,
                Venue = request.Venue,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                IsCancelled = false
            };

            _context.Meetups.Add(meetup);
            await _context.SaveChangesAsync(cancellationToken);
            
            return meetup.Id;
        }
    }
}