using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Meetups.Queries
{
    public class GetMeetupList
    {
        public class Query : IRequest<List<Meetup>> { }

        public class Handler(AppDbContext context) : IRequestHandler<Query, List<Meetup>>
        {
            public async Task<List<Meetup>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await context.Meetups.ToListAsync(cancellationToken);
            }
        }
    }
}