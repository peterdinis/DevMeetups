using Microsoft.EntityFrameworkCore;
using Persistence;
using Mapster;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Polly;
using Polly.Extensions.Http;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient("ResilientClient")
    .AddPolicyHandler(GetRetryPolicy())
    .AddPolicyHandler(GetCircuitBreakerPolicy());

builder.Services.AddSingleton<IAsyncPolicy>(serviceProvider =>
{
    var retryPolicy = Policy
        .Handle<Exception>()
        .WaitAndRetryAsync(
            retryCount: 3,
            sleepDurationProvider: retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
            onRetry: (exception, timeSpan, retryCount, context) =>
            {
                Console.WriteLine($"Retry {retryCount} after {timeSpan} due to: {exception.Message}");
            });

    return Policy.WrapAsync(retryPolicy);
});

builder.Services.AddSingleton<IAsyncPolicy>(serviceProvider =>
{
    return Policy
        .Handle<Exception>()
        .WaitAndRetryAsync(
            retryCount: 2,
            sleepDurationProvider: retryAttempt => TimeSpan.FromMilliseconds(500 * retryAttempt),
            onRetry: (exception, timeSpan, retryCount, context) =>
            {
                Console.WriteLine($"Identity operation retry {retryCount} after {timeSpan}");
            });
});

builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new Microsoft.AspNetCore.Mvc.Authorization.AuthorizeFilter(policy));
});

builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddOpenApi();
builder.Services.AddCors();

builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
}).AddRoles<IdentityRole>()
.AddEntityFrameworkStores<AppDbContext>();

builder.Services.AddScoped<Application.Meetups.Commands.CreateMeetupHandler>();
builder.Services.AddScoped<Application.Meetups.Commands.DeleteMeetupHandler>();
builder.Services.AddScoped<Application.Meetups.Commands.EditMeetupHandler>();
builder.Services.AddScoped<Application.Meetups.Queries.GetMeetupDetailsHandler>();
builder.Services.AddScoped<Application.Meetups.Queries.GetMeetupListHandler>();
builder.Services.AddScoped<Application.Meetups.Queries.SearchMeetupsHandler>();

builder.Services.AddMapster();

TypeAdapterConfig.GlobalSettings.Default.PreserveReference(true);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGroup("api").MapIdentityApi<User>(); // api/login

app.Run();

// Polly politiky pre HTTP klienta
static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
{
    return HttpPolicyExtensions
        .HandleTransientHttpError()
        .OrResult(msg => !msg.IsSuccessStatusCode)
        .WaitAndRetryAsync(
            retryCount: 3,
            sleepDurationProvider: retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
            onRetry: (outcome, timespan, retryCount, context) =>
            {
                Console.WriteLine($"HTTP Retry {retryCount} after {timespan} for {outcome.Result?.StatusCode}");
            });
}

static IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy()
{
    return HttpPolicyExtensions
        .HandleTransientHttpError()
        .CircuitBreakerAsync(
            handledEventsAllowedBeforeBreaking: 3,
            durationOfBreak: TimeSpan.FromSeconds(30)
        );
}