using Domain;
using Persistence;
using Microsoft.Extensions.Logging;
using Polly;

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

    public class CreateMeetupHandler
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CreateMeetupHandler> _logger;
        private readonly IAsyncPolicy _resiliencyPolicy; 

        public CreateMeetupHandler(
            AppDbContext context, 
            ILogger<CreateMeetupHandler> logger,
            IAsyncPolicy resiliencyPolicy)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _resiliencyPolicy = resiliencyPolicy ?? throw new ArgumentNullException(nameof(resiliencyPolicy));
        }

        public async Task<Result<string>> Handle(CreateMeetupCommand request, CancellationToken cancellationToken = default)
        {
            try
            {
                // Command validation
                var validationResult = ValidateCommand(request);
                if (!validationResult.IsValid)
                {
                    _logger.LogWarning("Validation failed for create meetup command: {Error}", validationResult.ErrorMessage);
                    return (Result<string>)Result.Failure(validationResult.ErrorMessage);
                }

                // Business validation - ensure date is in the future
                if (request.Date <= DateTime.UtcNow.AddHours(1))
                {
                    _logger.LogWarning("Attempt to create meetup with invalid date: {Date}", request.Date);
                    return (Result<string>)Result.Failure("Meetup date must be at least 1 hour in the future");
                }

                // Business validation - validate coordinates
                if (!IsValidCoordinates(request.Latitude, request.Longitude))
                {
                    _logger.LogWarning("Attempt to create meetup with invalid coordinates: Lat {Latitude}, Long {Longitude}", 
                        request.Latitude, request.Longitude);
                    return (Result<string>)Result.Failure("Invalid coordinates provided");
                }

                // Create Meetup entity
                var meetup = CreateMeetupEntity(request);
                
                await _resiliencyPolicy.ExecuteAsync(async (ct) =>
                {
                    _context.Meetups.Add(meetup);
                    await _context.SaveChangesAsync(ct);
                    
                    _logger.LogInformation("Meetup created successfully with ID '{MeetupId}'", meetup.Id);
                    
                }, cancellationToken);

                return Result.Success(meetup.Id);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                _logger.LogError(ex, "Error occurred while creating meetup");
                return (Result<string>)Result.Failure("An error occurred while creating the meetup. Please try again.");
            }
        }

        private ValidationResult ValidateCommand(CreateMeetupCommand request)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(request.Title))
                errors.Add("Title is required");
            else if (request.Title.Length < 3)
                errors.Add("Title must be at least 3 characters long");
            else if (request.Title.Length > 100)
                errors.Add("Title cannot exceed 100 characters");

            if (string.IsNullOrWhiteSpace(request.Description))
                errors.Add("Description is required");
            else if (request.Description.Length < 10)
                errors.Add("Description must be at least 10 characters long");
            else if (request.Description.Length > 1000)
                errors.Add("Description cannot exceed 1000 characters");

            if (string.IsNullOrWhiteSpace(request.Category))
                errors.Add("Category is required");
            else if (request.Category.Length > 50)
                errors.Add("Category cannot exceed 50 characters");

            if (string.IsNullOrWhiteSpace(request.City))
                errors.Add("City is required");
            else if (request.City.Length > 50)
                errors.Add("City cannot exceed 50 characters");

            if (string.IsNullOrWhiteSpace(request.Venue))
                errors.Add("Venue is required");
            else if (request.Venue.Length > 100)
                errors.Add("Venue cannot exceed 100 characters");

            return errors.Any() 
                ? ValidationResult.Invalid(string.Join("; ", errors))
                : ValidationResult.Valid();
        }

        private bool IsValidCoordinates(double latitude, double longitude)
        {
            return latitude >= -90 && latitude <= 90 && 
                   longitude >= -180 && longitude <= 180;
        }

        private Meetup CreateMeetupEntity(CreateMeetupCommand request)
        {
            return new Meetup
            {
                Id = Guid.NewGuid().ToString(),
                Title = request.Title.Trim(),
                Description = request.Description.Trim(),
                Date = request.Date,
                Category = request.Category.Trim(),
                City = request.City.Trim(),
                Venue = request.Venue.Trim(),
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                IsCancelled = false,
            };
        }
    }
}