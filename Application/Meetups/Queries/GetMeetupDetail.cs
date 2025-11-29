using Domain;
using Persistence;
using Microsoft.Extensions.Logging;
using Application.Validators;

namespace Application.Meetups.Queries
{
    public class GetMeetupDetailsHandler
    {
        private readonly AppDbContext _context;
        private readonly ILogger<GetMeetupDetailsHandler> _logger;

        public GetMeetupDetailsHandler(AppDbContext context, ILogger<GetMeetupDetailsHandler> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<Result<Meetup>> Handle(GetMeetupDetailsQuery query, CancellationToken cancellationToken = default)
        {
            try
            {
                // Query validation
                var validationResult = ValidateQuery(query);
                if (!validationResult.IsValid)
                {
                    _logger.LogWarning("Validation failed for get meetup details query: {Error}", validationResult.ErrorMessage);
                    return (Result<Meetup>)Result.Failure(validationResult.ErrorMessage);
                }

                // Find meetup
                var meetup = await _context.Meetups.FindAsync([query.Id], cancellationToken);

                if (meetup is null)
                {
                    _logger.LogWarning("Meetup with ID '{MeetupId}' not found", query.Id);
                    return (Result<Meetup>)Result.Failure($"Meetup with ID '{query.Id}' not found.");
                }

                // Business validation - check if meetup is cancelled (optional, depending on requirements)
                if (meetup.IsCancelled)
                {
                    _logger.LogInformation("Retrieved cancelled meetup with ID '{MeetupId}'", query.Id);
                }

                _logger.LogInformation("Meetup with ID '{MeetupId}' successfully retrieved", query.Id);
                return Result.Success(meetup);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                _logger.LogError(ex, "Error occurred while retrieving meetup with ID '{MeetupId}'", query.Id);
                return (Result<Meetup>)Result.Failure("An error occurred while retrieving the meetup. Please try again.");
            }
        }

        private static ValidationResult ValidateQuery(GetMeetupDetailsQuery query)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(query.Id))
            {
                errors.Add("Meetup ID is required");
            }
            else if (!Guid.TryParse(query.Id, out _))
            {
                errors.Add("Invalid meetup ID format");
            }

            return errors.Count != 0
                ? ValidationResult.Invalid(string.Join("; ", errors))
                : ValidationResult.Valid();
        }
    }

    public class GetMeetupDetailsQuery
    {
        public string Id { get; set; } = default!;

        public GetMeetupDetailsQuery() { }

        public GetMeetupDetailsQuery(string id)
        {
            Id = id;
        }
    }
}