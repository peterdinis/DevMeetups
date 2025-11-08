using MediatR;
using Persistence;

namespace Application.Meetups.Commands;

public class DeleteMeetup
{
    public class Command : IRequest
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command>
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            var meetup = await context.Meetups
                .FindAsync([request.Id], cancellationToken) 
                    ?? throw new Exception("Cannot find meetup");

            context.Remove(meetup);

            await context.SaveChangesAsync(cancellationToken);
        }
    }
}