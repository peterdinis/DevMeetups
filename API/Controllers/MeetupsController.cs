using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Meetups.Queries;
using Application.Meetups.Commands;
using Microsoft.AspNetCore.Authorization;
using Polly;
using Polly.CircuitBreaker;
using Polly.Timeout;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MeetupsController : ControllerBase
    {
        private readonly GetMeetupListHandler _getMeetupListHandler;
        private readonly GetMeetupDetailsHandler _getMeetupDetailsHandler;
        private readonly CreateMeetupHandler _createMeetupHandler;
        private readonly EditMeetupHandler _editMeetupHandler;
        private readonly DeleteMeetupHandler _deleteMeetupHandler;
        private readonly ILogger<MeetupsController> _logger;
        private readonly AsyncPolicy _resiliencyPolicy;

        public MeetupsController(
            GetMeetupListHandler getMeetupListHandler,
            GetMeetupDetailsHandler getMeetupDetailsHandler,
            CreateMeetupHandler createMeetupHandler,
            EditMeetupHandler editMeetupHandler,
            DeleteMeetupHandler deleteMeetupHandler,
            ILogger<MeetupsController> logger)
        {
            _getMeetupListHandler = getMeetupListHandler;
            _getMeetupDetailsHandler = getMeetupDetailsHandler;
            _createMeetupHandler = createMeetupHandler;
            _editMeetupHandler = editMeetupHandler;
            _deleteMeetupHandler = deleteMeetupHandler;
            _logger = logger;
            
            _resiliencyPolicy = CreateResiliencyPolicy();
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<List<Meetup>>> GetMeetups()
        {
            try
            {
                var query = new GetMeetupListQuery();
                var result = await _resiliencyPolicy.ExecuteAsync(async () =>
                {
                    return await _getMeetupListHandler.Handle(query);
                });

                if (result.IsSuccess)
                {
                    return Ok(result.Value);
                }

                return MapErrorToActionResult(result.Error);
            }
            catch (TimeoutRejectedException)
            {
                _logger.LogWarning("Timeout occurred while getting meetups list");
                return StatusCode(408, new { error = "Request timeout. Please try again." });
            }
            catch (BrokenCircuitException)
            {
                _logger.LogError("Circuit breaker open while getting meetups list");
                return StatusCode(503, new { error = "Service temporarily unavailable. Please try again later." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting meetups list");
                return StatusCode(500, new { error = "An error occurred while retrieving meetups." });
            }
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<Meetup>> GetMeetupDetail(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                {
                    return BadRequest(new { error = "Meetup ID is required" });
                }

                var query = new GetMeetupDetailsQuery { Id = id };
                var result = await _resiliencyPolicy.ExecuteAsync(async () =>
                {
                    return await _getMeetupDetailsHandler.Handle(query);
                });

                if (result.IsSuccess)
                {
                    return Ok(result.Value);
                }

                return MapErrorToActionResult(result.Error);
            }
            catch (TimeoutRejectedException)
            {
                _logger.LogWarning("Timeout occurred while getting meetup details for ID: {MeetupId}", id);
                return StatusCode(408, new { error = "Request timeout. Please try again." });
            }
            catch (BrokenCircuitException)
            {
                _logger.LogError("Circuit breaker open while getting meetup details for ID: {MeetupId}", id);
                return StatusCode(503, new { error = "Service temporarily unavailable. Please try again later." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting meetup details for ID: {MeetupId}", id);
                return StatusCode(500, new { error = "An error occurred while retrieving meetup details." });
            }
        }
        
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<string>> CreateMeetup([FromBody] CreateMeetupCommand command)
        {
            try
            {
                if (command == null)
                {
                    return BadRequest(new { error = "Meetup data is required" });
                }

                var result = await _resiliencyPolicy.ExecuteAsync(async () =>
                {
                    return await _createMeetupHandler.Handle(command);
                });

                if (result.IsSuccess)
                {
                    _logger.LogInformation("Meetup created successfully with ID: {MeetupId}", result.Value);
                    return CreatedAtAction(nameof(GetMeetupDetail), new { id = result.Value }, new { id = result.Value });
                }
                
                return MapErrorToActionResult(result.Error);
            }
            catch (TimeoutRejectedException)
            {
                _logger.LogWarning("Timeout occurred while creating meetup");
                return StatusCode(408, new { error = "Request timeout. Please try again." });
            }
            catch (BrokenCircuitException)
            {
                _logger.LogError("Circuit breaker open while creating meetup");
                return StatusCode(503, new { error = "Service temporarily unavailable. Please try again later." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating meetup");
                return StatusCode(500, new { error = "An error occurred while creating the meetup." });
            }
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult> EditMeetup(string id, [FromBody] EditMeetupCommand command)
        {
            try
            {
                if (command == null)
                {
                    return BadRequest(new { error = "Meetup data is required" });
                }

                if (string.IsNullOrWhiteSpace(id))
                {
                    return BadRequest(new { error = "Meetup ID is required" });
                }

                command.Id = id;
                var result = await _resiliencyPolicy.ExecuteAsync(async () =>
                {
                    return await _editMeetupHandler.Handle(command);
                });

                if (result.IsSuccess)
                {
                    return NoContent();
                }

                return MapErrorToActionResult(result.Error);
            }
            catch (TimeoutRejectedException)
            {
                _logger.LogWarning("Timeout occurred while editing meetup with ID: {MeetupId}", id);
                return StatusCode(408, new { error = "Request timeout. Please try again." });
            }
            catch (BrokenCircuitException)
            {
                _logger.LogError("Circuit breaker open while editing meetup with ID: {MeetupId}", id);
                return StatusCode(503, new { error = "Service temporarily unavailable. Please try again later." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while editing meetup with ID: {MeetupId}", id);
                return StatusCode(500, new { error = "An error occurred while updating the meetup." });
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMeetup(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                {
                    return BadRequest(new { error = "Meetup ID is required" });
                }

                var command = new DeleteMeetupCommand { Id = id };
                var result = await _resiliencyPolicy.ExecuteAsync(async () =>
                {
                    return await _deleteMeetupHandler.Handle(command);
                });

                if (result.IsSuccess)
                {
                    _logger.LogInformation("Meetup deleted successfully with ID: {MeetupId}", id);
                    return NoContent();
                }

                return MapErrorToActionResult(result.Error);
            }
            catch (TimeoutRejectedException)
            {
                _logger.LogWarning("Timeout occurred while deleting meetup with ID: {MeetupId}", id);
                return StatusCode(408, new { error = "Request timeout. Please try again." });
            }
            catch (BrokenCircuitException)
            {
                _logger.LogError("Circuit breaker open while deleting meetup with ID: {MeetupId}", id);
                return StatusCode(503, new { error = "Service temporarily unavailable. Please try again later." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting meetup with ID: {MeetupId}", id);
                return StatusCode(500, new { error = "An error occurred while deleting the meetup." });
            }
        }

        private ActionResult MapErrorToActionResult(string error)
        {
            if (string.IsNullOrEmpty(error))
            {
                return StatusCode(500, new { error = "An unknown error occurred" });
            }

            var lowerError = error.ToLower();
            return lowerError switch
            {
                var e when e.Contains("not found") => NotFound(new { error }),
                var e when e.Contains("required") || e.Contains("invalid") || e.Contains("cannot exceed") || 
                           e.Contains("must be at least") || e.Contains("cannot be more than") => 
                    BadRequest(new { error }),
                var e when e.Contains("already occurred") || e.Contains("cancelled") || e.Contains("future") || 
                           e.Contains("past") || e.Contains("already cancelled") => 
                    BadRequest(new { error }),
                var e when e.Contains("unauthorized") || e.Contains("forbidden") => 
                    Unauthorized(new { error }),
                _ => StatusCode(500, new { error = "An unexpected error occurred" })
            };
        }

        private AsyncPolicy CreateResiliencyPolicy()
        {
            var retryPolicy = Policy
                .Handle<Exception>()
                .WaitAndRetryAsync(
                    retryCount: 2,
                    sleepDurationProvider: retryAttempt => TimeSpan.FromMilliseconds(100 * retryAttempt),
                    onRetry: (exception, timeSpan, retryCount, context) =>
                    {
                        _logger.LogWarning("Retry {RetryCount} for meetup operation after {Delay}ms", retryCount, timeSpan.TotalMilliseconds);
                    });

            var timeoutPolicy = Policy
                .TimeoutAsync(TimeSpan.FromSeconds(10), TimeoutStrategy.Optimistic);

            var circuitBreakerPolicy = Policy
                .Handle<Exception>();

            return Policy.WrapAsync(retryPolicy, timeoutPolicy);
        }
    }
}