using Microsoft.EntityFrameworkCore;
using Persistence;
using Mapster;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddOpenApi();
builder.Services.AddCors();

// Register your application services manually
builder.Services.AddScoped<Application.Meetups.Commands.CreateMeetupHandler>();
builder.Services.AddScoped<Application.Meetups.Commands.DeleteMeetupService>();
builder.Services.AddScoped<Application.Meetups.Commands.EditMeetupHandler>();
builder.Services.AddScoped<Application.Meetups.Queries.GetMeetupDetailsService>();
builder.Services.AddScoped<Application.Meetups.Queries.GetMeetupListHandler>();

// Configure Mapster
builder.Services.AddMapster();

// Optional: Configure Mapster mappings if needed
TypeAdapterConfig.GlobalSettings.Default.PreserveReference(true);

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors();

app.MapControllers();

app.Run();