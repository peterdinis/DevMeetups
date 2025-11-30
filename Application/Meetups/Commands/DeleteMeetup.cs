using Persistence;
using Microsoft.Extensions.Logging;
using Polly;
using Polly.Retry;

namespace Application.Meetups.Commands
{
    public class DeleteMeetupHandler(AppDbContext context, ILogger<DeleteMeetupHandler> logger)
    {
<<<<<<< HEAD
        private readonly AppDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly ILogger<DeleteMeetupHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));
=======
        private readonly AppDbContext _context;
        private readonly ILogger<DeleteMeetupHandler> _logger;
        private readonly AsyncRetryPolicy _retryPolicy;

        public DeleteMeetupHandler(AppDbContext context, ILogger<DeleteMeetupHandler> logger)
        { 
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

            _retryPolicy = Policy
                .Handle<Exception>()
                .WaitAndRetryAsync(
                    retryCount: 3,
                    sleepDurationProvider: retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
                    onRetry: (exception, timeSpan, retryCount, context) =>
                    {
                        _logger.LogWarning(
                            "Delete operation retry {RetryCount} after {Delay}ms due to: {ExceptionMessage}",
                            retryCount,
                            timeSpan.TotalMilliseconds,
                            exception.Message);
                    });
        }
>>>>>>> main

        public async Task<Result> Handle(DeleteMeetupCommand command, CancellationToken cancellationToken = default)
        {
            try
            {
                // Command validation
                var validationResult = ValidateCommand(command);
                if (!validationResult.IsValid)
                {
                    _logger.LogWarning("Validation failed for delete meetup command: {Error}", validationResult.ErrorMessage);
                    return Result.Failure(validationResult.ErrorMessage);
                }

<<<<<<< HEAD
                // Find meetup
                var meetup = await _context.Meetups.FindAsync([command.Id], cancellationToken);
=======
                var meetup = await _retryPolicy.ExecuteAsync(async (ct) =>
                {
                    return await _context.Meetups.FindAsync(new object[] { command.Id }, ct);
                }, cancellationToken);
>>>>>>> main

                if (meetup is null)
                {
                    _logger.LogWarning("Meetup with ID '{MeetupId}' not found for deletion", command.Id);
                    return Result.Failure($"Meetup with ID '{command.Id}' not found.");
                }

                // Business validation - check if meetup is already cancelled
                if (meetup.IsCancelled)
                {
                    _logger.LogWarning("Attempt to delete already cancelled meetup with ID '{MeetupId}'", command.Id);
                    return Result.Failure($"Meetup with ID '{command.Id}' is already cancelled.");
                }

                // Check if meetup hasn't occurred yet
                if (meetup.Date <= DateTime.UtcNow)
                {
                    _logger.LogWarning("Attempt to delete past meetup with ID '{MeetupId}'", command.Id);
                    return Result.Failure("Cannot delete meetups that have already occurred.");
                }
                
                await _retryPolicy.ExecuteAsync(async (ct) =>
                {
                    _context.Meetups.Remove(meetup);
                    await _context.SaveChangesAsync(ct);
                    
                    _logger.LogInformation("Meetup with ID '{MeetupId}' successfully deleted", command.Id);
                    
                }, cancellationToken);

                return Result.Success();
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                _logger.LogError(ex, "Error occurred while deleting meetup with ID '{MeetupId}'", command.Id);
                return Result.Failure("An error occurred while deleting the meetup. Please try again.");
            }
        }

        private static ValidationResult ValidateCommand(DeleteMeetupCommand command)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(command.Id))
            {
                errors.Add("Meetup ID is required");
            }
            else if (!Guid.TryParse(command.Id, out _))
            {
                errors.Add("Invalid meetup ID format");
            }

            return errors.Count != 0
                ? ValidationResult.Invalid(string.Join("; ", errors))
                : ValidationResult.Valid();
        }
    }

    public class DeleteMeetupCommand
    {
        public string Id { get; set; } = default!;

        public DeleteMeetupCommand() { }

        public DeleteMeetupCommand(string id)
        {
            Id = id;
        }
    }
}