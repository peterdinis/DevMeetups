using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Microsoft.Extensions.Logging;
using Application.Validators;
using Polly;
using Polly.Retry;

namespace Application.Meetups.Queries
{
    public class GetMeetupListQuery
    {
        public bool? IncludeCancelled { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string? Category { get; set; }
        public string? City { get; set; }
    }
    
    public class GetMeetupListHandler(AppDbContext context, ILogger<GetMeetupListHandler> logger)
    {
        private readonly AppDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly ILogger<GetMeetupListHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        private readonly AsyncRetryPolicy _retryPolicy = CreateRetryPolicy(logger);

        private static AsyncRetryPolicy CreateRetryPolicy(ILogger<GetMeetupListHandler> logger)
        {
            return Policy
                .Handle<Exception>()
                .Or<DbUpdateException>()
                .WaitAndRetryAsync(
                    retryCount: 2,
                    sleepDurationProvider: retryAttempt => TimeSpan.FromMilliseconds(150 * retryAttempt),
                    onRetry: (exception, timeSpan, retryCount, context) =>
                    {
                        logger.LogWarning(
                            "GetMeetupList retry {RetryCount} after {Delay}ms due to: {ExceptionMessage}",
                            retryCount,
                            timeSpan.TotalMilliseconds,
                            exception.Message);
                    });
        }

        public async Task<Result<List<Meetup>>> Handle(GetMeetupListQuery query, CancellationToken cancellationToken = default)
        {
            try
            {
                var validationResult = ValidateQuery(query);
                if (!validationResult.IsValid)
                {
                    _logger.LogWarning("Validation failed for get meetup list query: {Error}", validationResult.ErrorMessage);
                    return (Result<List<Meetup>>)Result.Failure(validationResult.ErrorMessage);
                }

                var meetupsQuery = BuildMeetupsQuery(query);
                
                var meetups = await _retryPolicy.ExecuteAsync(async (ct) =>
                {
                    return await meetupsQuery.ToListAsync(ct);
                }, cancellationToken);

                _logger.LogInformation("Retrieved {MeetupCount} meetups from database", meetups.Count);
                return Result.Success(meetups);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                _logger.LogError(ex, "Error occurred while retrieving meetup list");
                return (Result<List<Meetup>>)Result.Failure("An error occurred while retrieving meetups. Please try again.");
            }
        }

        private static ValidationResult ValidateQuery(GetMeetupListQuery query)
        {
            var errors = new List<string>();
            
            if (query.FromDate.HasValue && query.ToDate.HasValue)
            {
                if (query.FromDate.Value > query.ToDate.Value)
                {
                    errors.Add("From date cannot be after to date");
                }

                if (query.ToDate.Value < DateTime.UtcNow.AddYears(-1))
                {
                    errors.Add("Date range cannot be more than 1 year in the past");
                }
            }

            // Validate individual dates
            if (query.FromDate.HasValue && query.FromDate.Value > DateTime.UtcNow.AddYears(1))
            {
                errors.Add("From date cannot be more than 1 year in the future");
            }

            if (query.ToDate.HasValue && query.ToDate.Value > DateTime.UtcNow.AddYears(1))
            {
                errors.Add("To date cannot be more than 1 year in the future");
            }

            // Validate category length if provided
            if (!string.IsNullOrEmpty(query.Category) && query.Category.Length > 50)
            {
                errors.Add("Category filter cannot exceed 50 characters");
            }

            // Validate city length if provided
            if (!string.IsNullOrEmpty(query.City) && query.City.Length > 50)
            {
                errors.Add("City filter cannot exceed 50 characters");
            }

            return errors.Any() 
                ? ValidationResult.Invalid(string.Join("; ", errors))
                : ValidationResult.Valid();
        }

        private IQueryable<Meetup> BuildMeetupsQuery(GetMeetupListQuery query)
        {
            var meetupsQuery = _context.Meetups.AsQueryable();

            // Apply filters based on query parameters
            if (!query.IncludeCancelled.GetValueOrDefault())
            {
                meetupsQuery = meetupsQuery.Where(m => !m.IsCancelled);
            }

            if (query.FromDate.HasValue)
            {
                meetupsQuery = meetupsQuery.Where(m => m.Date >= query.FromDate.Value);
            }

            if (query.ToDate.HasValue)
            {
                meetupsQuery = meetupsQuery.Where(m => m.Date <= query.ToDate.Value);
            }

            if (!string.IsNullOrEmpty(query.Category))
            {
                meetupsQuery = meetupsQuery.Where(m => m.Category == query.Category);
            }

            if (!string.IsNullOrEmpty(query.City))
            {
                meetupsQuery = meetupsQuery.Where(m => m.City == query.City);
            }

            // Default ordering by date (newest first)
            meetupsQuery = meetupsQuery.OrderBy(m => m.Date);

            return meetupsQuery;
        }
    }
}