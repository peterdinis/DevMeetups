using MediatR;
using Persistence;
using Domain;

namespace Application.Meetups.Commands;

public class CreateMeetup
{
    public class Command : IRequest<string>
    {
        public required Meetup Meetup { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command, string>
    {
        public async Task<string> Handle(Command request, CancellationToken cancellationToken)
        {
            context.Meetups.Add(request.Meetup);

            await context.SaveChangesAsync(cancellationToken);

            return request.Meetup.Id;
        }
    }
}