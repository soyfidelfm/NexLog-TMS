using NexLog.BuildingBlocks.Web.Hosting;
using NexLog.Exceptions.Application;
using NexLog.Exceptions.Infrastructure;
using NexLog.Exceptions.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);
builder.AddNexLogService<ExceptionsDbContext>(ExceptionsDbContext.Schema);
builder.Services.AddExceptionsApplication().AddExceptionsInfrastructure();

var app = builder.Build();
await app.RunNexLogServiceAsync<ExceptionsDbContext>(ExceptionsSeed.SeedAsync);
