using NexLog.BuildingBlocks.Web.Hosting;
using NexLog.Loads.Application;
using NexLog.Loads.Infrastructure;
using NexLog.Loads.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);
builder.AddNexLogService<LoadsDbContext>(LoadsDbContext.Schema);
builder.Services.AddLoadsApplication().AddLoadsInfrastructure();

var app = builder.Build();
await app.RunNexLogServiceAsync<LoadsDbContext>(LoadsSeed.SeedAsync);
