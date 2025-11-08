using DispatchR.Mediator.Abstractions;
using Domain;
using Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Meetups
{
    // Namiesto celého Meetup objektu by malo ísť o DTO s potrebnými údajmi
    public record CreateMeetupCommand(
        string Title,
        string Description,
        DateTime StartDate,
        DateTime EndDate,
        string Location) : IRequest<string>;

    public class CreateMeetupHandler : IRequestHandler<CreateMeetupCommand, string>
    {
        private readonly AppDbContext _context;

        public CreateMeetupHandler(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<string> Handle(CreateMeetupCommand request, CancellationToken cancellationToken)
        {
            // Validácia vstupu
            if (string.IsNullOrWhiteSpace(request.Title))
                throw new ArgumentException("Title is required", nameof(request.Title));

            if (request.StartDate >= request.EndDate)
                throw new ArgumentException("Start date must be before end date");

            // Vytvorenie Meetup entity v handleri
            var meetup = new Meetup
            {
                Id = Guid.NewGuid().ToString(), // alebo iný spôsob generovania ID
                Title = request.Title,
                Description = request.Description,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Location = request.Location,
                CreatedAt = DateTime.UtcNow
            };

            _context.Meetups.Add(meetup);
            await _context.SaveChangesAsync(cancellationToken);
            
            return meetup.Id;
        }
    }
}