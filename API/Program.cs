using Microsoft.EntityFrameworkCore;
using Persistence;
using Application.Meetups.Queries;
using Application.Core;
using AutoMapper;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddOpenApi();
builder.Services.AddCors();

builder.Services.AddMediatR(x =>
    x.RegisterServicesFromAssemblyContaining<GetMeetupList.Handler>());

// Configure AutoMapper manually (compatible with AutoMapper 14+)
builder.Services.AddSingleton<IMapper>(sp =>
{
    var loggerFactory = sp.GetRequiredService<ILoggerFactory>();

    var configExpr = new MapperConfigurationExpression();
    configExpr.AddProfile<MappingProfiles>();

    var config = new MapperConfiguration(configExpr, loggerFactory);
    return new Mapper(config);
});

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
