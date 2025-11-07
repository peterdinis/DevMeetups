using Domain;
using MediatR;
using Persistence;

namespace Application.Meetups.Queries;

public class GetMeetupDetails
{
    public class Query : IRequest<Meetup>
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Query, Meetup>
    {
        public async Task<Meetup> Handle(Query request, CancellationToken cancellationToken)
        {
            var meetup = await context.Meetups.FindAsync([request.Id], cancellationToken) ?? throw new Exception("Meetup not found");
            return meetup;
        }
    }
}