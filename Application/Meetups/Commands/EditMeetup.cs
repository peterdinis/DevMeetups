using Domain;
using Persistence;
using Microsoft.Extensions.Logging;
using Polly;
using Microsoft.EntityFrameworkCore;

namespace Application.Meetups.Commands
{
    public class EditMeetupCommand
    {
        public string Id { get; set; } = default!;
        public required MeetupData Meetup { get; set; }
    }

    public class MeetupData
    {
        public string Title { get; set; } = default!;
        public string Description { get; set; } = default!;
        public DateTime Date { get; set; }
        public string Category { get; set; } = default!;
        public string City { get; set; } = default!;
        public string Venue { get; set; } = default!;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    public class EditMeetupHandler
    {
        private readonly AppDbContext _context;
        private readonly ILogger<EditMeetupHandler> _logger;
        private readonly AsyncPolicy _resiliencyPolicy;

        public EditMeetupHandler(AppDbContext context, ILogger<EditMeetupHandler> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

            _resiliencyPolicy = Policy
                .Handle<Exception>()
                .WaitAndRetryAsync(
                    retryCount: 3,
                    sleepDurationProvider: retryAttempt => TimeSpan.FromSeconds(retryAttempt),
                    onRetry: (exception, timeSpan, retryCount, context) =>
                    {
                        _logger.LogWarning(
                            "Edit operation retry {RetryCount} after {Delay}ms due to: {ExceptionType} - {ExceptionMessage}",
                            retryCount,
                            timeSpan.TotalMilliseconds,
                            exception.GetType().Name,
                            exception.Message);
                    });
        }

        public async Task<Result> Handle(EditMeetupCommand request, CancellationToken cancellationToken = default)
        {
            try
            {
                // Command validation
                var validationResult = ValidateCommand(request);
                if (!validationResult.IsValid)
                {
                    _logger.LogWarning("Validation failed for edit meetup command: {Error}", validationResult.ErrorMessage);
                    return Result.Failure(validationResult.ErrorMessage);
                }

                await _resiliencyPolicy.ExecuteAsync(async (ct) =>
                {
                    // Find existing meetup
                    var meetup = await _context.Meetups.FindAsync(new object[] { request.Id }, ct);
                    if (meetup is null)
                        throw new Exception($"Meetup with ID '{request.Id}' not found.");

                    // Business validations
                    if (meetup.IsCancelled)
                        throw new Exception("Cannot edit a cancelled meetup.");

                    if (meetup.Date < DateTime.UtcNow)
                        throw new Exception("Cannot edit meetups that have already occurred.");

                    if (request.Meetup.Date <= DateTime.UtcNow.AddHours(1))
                        throw new Exception("Meetup date must be at least 1 hour in the future.");

                    // Update meetup properties
                    UpdateMeetupProperties(meetup, request.Meetup);

                    // Save changes
                    await _context.SaveChangesAsync(ct);
                    
                    _logger.LogInformation("Meetup with ID '{MeetupId}' successfully updated", request.Id);
                    
                }, cancellationToken);

                return Result.Success();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogWarning(ex, "Concurrency conflict while editing meetup with ID '{MeetupId}'", request.Id);
                return Result.Failure("This meetup was modified by another user. Please refresh and try again.");
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                _logger.LogError(ex, "Error occurred while editing meetup with ID '{MeetupId}'", request.Id);
                return Result.Failure($"An error occurred while updating the meetup: {ex.Message}");
            }
        }

        private ValidationResult ValidateCommand(EditMeetupCommand command)
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

            if (command.Meetup is null)
            {
                errors.Add("Meetup data is required");
                return ValidationResult.Invalid(string.Join("; ", errors));
            }

            if (string.IsNullOrWhiteSpace(command.Meetup.Title))
                errors.Add("Title is required");
            else if (command.Meetup.Title.Length < 3)
                errors.Add("Title must be at least 3 characters long");
            else if (command.Meetup.Title.Length > 100)
                errors.Add("Title cannot exceed 100 characters");

            if (string.IsNullOrWhiteSpace(command.Meetup.Description))
                errors.Add("Description is required");
            else if (command.Meetup.Description.Length < 10)
                errors.Add("Description must be at least 10 characters long");
            else if (command.Meetup.Description.Length > 1000)
                errors.Add("Description cannot exceed 1000 characters");

            if (string.IsNullOrWhiteSpace(command.Meetup.Category))
                errors.Add("Category is required");
            else if (command.Meetup.Category.Length > 50)
                errors.Add("Category cannot exceed 50 characters");

            if (string.IsNullOrWhiteSpace(command.Meetup.City))
                errors.Add("City is required");
            else if (command.Meetup.City.Length > 50)
                errors.Add("City cannot exceed 50 characters");

            if (string.IsNullOrWhiteSpace(command.Meetup.Venue))
                errors.Add("Venue is required");
            else if (command.Meetup.Venue.Length > 100)
                errors.Add("Venue cannot exceed 100 characters");

            if (command.Meetup.Latitude < -90 || command.Meetup.Latitude > 90)
                errors.Add("Latitude must be between -90 and 90");

            if (command.Meetup.Longitude < -180 || command.Meetup.Longitude > 180)
                errors.Add("Longitude must be between -180 and 180");

            return errors.Any() 
                ? ValidationResult.Invalid(string.Join("; ", errors))
                : ValidationResult.Valid();
        }

        private void UpdateMeetupProperties(Meetup meetup, MeetupData meetupData)
        {
            meetup.Title = meetupData.Title.Trim();
            meetup.Description = meetupData.Description.Trim();
            meetup.Date = meetupData.Date;
            meetup.Category = meetupData.Category.Trim();
            meetup.City = meetupData.City.Trim();
            meetup.Venue = meetupData.Venue.Trim();
            meetup.Latitude = meetupData.Latitude;
            meetup.Longitude = meetupData.Longitude;
        }
    }
    
    public class Result
    {
        public bool IsSuccess { get; }
        public string Error { get; }
        public bool IsFailure => !IsSuccess;

        protected Result(bool isSuccess, string error)
        {
            IsSuccess = isSuccess;
            Error = error;
        }

        public static Result Success() => new Result(true, string.Empty);
        public static Result Failure(string error) => new Result(false, error);
        public static Result<T> Success<T>(T value) => new Result<T>(value, true, string.Empty);
        public static Result<T> Failure<T>(string error) => new Result<T>(default!, false, error);
    }

    public class Result<T> : Result
    {
        private readonly T _value;

        public T Value => IsSuccess ? _value : throw new InvalidOperationException("Cannot access Value of failed result");

        protected internal Result(T value, bool isSuccess, string error)
            : base(isSuccess, error)
        {
            _value = value;
        }
    }

    public class ValidationResult
    {
        public bool IsValid { get; }
        public string ErrorMessage { get; }

        private ValidationResult(bool isValid, string errorMessage)
        {
            IsValid = isValid;
            ErrorMessage = errorMessage;
        }

        public static ValidationResult Valid() => new ValidationResult(true, string.Empty);
        public static ValidationResult Invalid(string errorMessage) => new ValidationResult(false, errorMessage);
    }
}