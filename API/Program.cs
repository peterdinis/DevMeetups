using Microsoft.EntityFrameworkCore;
using Persistence;
using Mapster;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddOpenApi();
builder.Services.AddCors();


builder.Services.AddScoped<Application.Meetups.Commands.CreateMeetupHandler>();
builder.Services.AddScoped<Application.Meetups.Commands.DeleteMeetupHandler>();
builder.Services.AddScoped<Application.Meetups.Commands.EditMeetupHandler>();
builder.Services.AddScoped<Application.Meetups.Queries.GetMeetupDetailsHandler>();
builder.Services.AddScoped<Application.Meetups.Queries.GetMeetupListHandler>();

builder.Services.AddMapster();

TypeAdapterConfig.GlobalSettings.Default.PreserveReference(true);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors();

app.MapControllers();

app.Run();