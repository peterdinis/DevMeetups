using Microsoft.EntityFrameworkCore;
using Persistence;
using Mapster;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

var builder = WebApplication.CreateBuilder(args);

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