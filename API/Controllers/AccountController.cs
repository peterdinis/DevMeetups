using API.DTOs;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Polly;
using Polly.Retry;

namespace API.Controllers;

public class AccountController : BaseApiController
{
    private readonly SignInManager<User> _signInManager;
    private readonly ILogger<AccountController> _logger;
    private readonly AsyncRetryPolicy _retryPolicy;

    public AccountController(SignInManager<User> signInManager, ILogger<AccountController> logger)
    {
        _signInManager = signInManager;
        _logger = logger;

        _retryPolicy = Policy
            .Handle<Exception>()
            .WaitAndRetryAsync(
                retryCount: 3,
                sleepDurationProvider: retryAttempt => TimeSpan.FromMilliseconds(200 * retryAttempt),
                onRetry: (exception, timeSpan, retryCount, context) =>
                {
                    _logger.LogWarning(
                        "Identity operation retry {RetryCount} after {Delay}ms due to: {ExceptionMessage}",
                        retryCount,
                        timeSpan.TotalMilliseconds,
                        exception.Message);
                });
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
    {
        if (string.IsNullOrWhiteSpace(registerDto.Email) || 
            string.IsNullOrWhiteSpace(registerDto.Password))
        {
            ModelState.AddModelError("Input", "Email and password are required");
            return ValidationProblem();
        }

        var user = new User
        {
            UserName = registerDto.Email.Trim(),
            Email = registerDto.Email.Trim(),
            DisplayName = registerDto.DisplayName?.Trim()
        };

        try
        {
            var result = await _retryPolicy.ExecuteAsync(async () =>
            {
                return await _signInManager.UserManager.CreateAsync(user, registerDto.Password);
            });

            if (result.Succeeded) 
            {
                _logger.LogInformation("User {Email} registered successfully with ID {UserId}", registerDto.Email, user.Id);

                await _retryPolicy.ExecuteAsync(async () =>
                {
                    await _signInManager.SignInAsync(user, isPersistent: false);
                });
                
                return Ok(new { Message = "User registered successfully", UserId = user.Id });
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            _logger.LogWarning("User registration failed for {Email}", registerDto.Email);
            return ValidationProblem();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for {Email}", registerDto.Email);
            ModelState.AddModelError("Service", "An error occurred during registration. Please try again.");
            return ValidationProblem();
        }
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult> Login(LoginDto loginDto)
    {
        try
        {
            var result = await _retryPolicy.ExecuteAsync(async () =>
            {
                return await _signInManager.PasswordSignInAsync(
                    loginDto.Email, 
                    loginDto.Password, 
                    loginDto.RememberMe, 
                    lockoutOnFailure: false);
            });

            if (result.Succeeded)
            {
                _logger.LogInformation("User {Email} logged in successfully", loginDto.Email);
                return Ok(new { Message = "Login successful" });
            }

            if (result.IsLockedOut)
            {
                _logger.LogWarning("Login failed for {Email} - account locked out", loginDto.Email);
                ModelState.AddModelError("Account", "Account is locked out");
                return ValidationProblem();
            }

            _logger.LogWarning("Login failed for {Email} - invalid credentials", loginDto.Email);
            ModelState.AddModelError("Credentials", "Invalid email or password");
            return ValidationProblem();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for {Email}", loginDto.Email);
            ModelState.AddModelError("Service", "An error occurred during login. Please try again.");
            return ValidationProblem();
        }
    }

    [AllowAnonymous]
    [HttpGet("user-info")]
    public async Task<ActionResult> GetUserInfo() 
    {
        if (User.Identity?.IsAuthenticated == false) 
        {
            return NoContent();
        }

        try
        {
            var user = await _retryPolicy.ExecuteAsync(async () =>
            {
                return await _signInManager.UserManager.GetUserAsync(User);
            });

            if (user == null) 
            {
                _logger.LogWarning("User not found for authenticated identity");
                return Unauthorized();
            }

            _logger.LogInformation("Retrieved user info for {Email}", user.Email);
            return Ok(new 
            {
                user.DisplayName,
                user.Email,
                user.Id,
                user.ImageUrl
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user info");
            return StatusCode(500, new { Message = "An error occurred while retrieving user information" });
        }
    } 

    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        try
        {
            await _retryPolicy.ExecuteAsync(async () =>
            {
                await _signInManager.SignOutAsync();
            });

            _logger.LogInformation("User logged out successfully");
            return Ok(new { Message = "Logout successful" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout");
            return Ok(new { Message = "Logout completed" });
        }
    }
}