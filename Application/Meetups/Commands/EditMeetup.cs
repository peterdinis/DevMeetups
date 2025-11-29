using Domain;
using Persistence;
using Microsoft.Extensions.Logging;
using Application.Validators;

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

    public class EditMeetupHandler(AppDbContext context, ILogger<EditMeetupHandler> logger)
    {
        private readonly AppDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly ILogger<EditMeetupHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

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

                // Find existing meetup
                var meetup = await _context.Meetups.FindAsync(new object[] { request.Id }, cancellationToken);
                if (meetup is null)
                {
                    _logger.LogWarning("Meetup with ID '{MeetupId}' not found for editing", request.Id);
                    return Result.Failure($"Meetup with ID '{request.Id}' not found.");
                }

                // Business validation - check if meetup is cancelled
                if (meetup.IsCancelled)
                {
                    _logger.LogWarning("Attempt to edit cancelled meetup with ID '{MeetupId}'", request.Id);
                    return Result.Failure("Cannot edit a cancelled meetup.");
                }

                // Business validation - check if meetup date is in the past
                if (meetup.Date < DateTime.UtcNow)
                {
                    _logger.LogWarning("Attempt to edit past meetup with ID '{MeetupId}'", request.Id);
                    return Result.Failure("Cannot edit meetups that have already occurred.");
                }

                // Business validation - ensure new date is in the future
                if (request.Meetup.Date <= DateTime.UtcNow.AddHours(1))
                {
                    _logger.LogWarning("Attempt to set meetup date to past or too soon for ID '{MeetupId}'", request.Id);
                    return Result.Failure("Meetup date must be at least 1 hour in the future.");
                }

                // Update meetup properties
                UpdateMeetupProperties(meetup, request.Meetup);

                // Save changes
                await _context.SaveChangesAsync(cancellationToken);

                _logger.LogInformation("Meetup with ID '{MeetupId}' successfully updated", request.Id);
                return Result.Success();
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                _logger.LogError(ex, "Error occurred while editing meetup with ID '{MeetupId}'", request.Id);
                return Result.Failure("An error occurred while updating the meetup. Please try again.");
            }
        }

        private ValidationResult ValidateCommand(EditMeetupCommand command)
        {
            var errors = new List<string>();

            // Validate ID
            if (string.IsNullOrWhiteSpace(command.Id))
            {
                errors.Add("Meetup ID is required");
            }
            else if (!Guid.TryParse(command.Id, out _))
            {
                errors.Add("Invalid meetup ID format");
            }

            // Validate Meetup data
            if (command.Meetup is null)
            {
                errors.Add("Meetup data is required");
                return ValidationResult.Invalid(string.Join("; ", errors));
            }

            // Validate individual properties
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
            // IsCancelled is intentionally not updated
        }
    }
}