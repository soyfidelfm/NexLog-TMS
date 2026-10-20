using NexLog.BuildingBlocks.Web.Hosting;
using NexLog.RateTables.Application;
using NexLog.RateTables.Infrastructure;
using NexLog.RateTables.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);
builder.AddNexLogService<RateTablesDbContext>(RateTablesDbContext.Schema);
builder.Services.AddRateTablesApplication().AddRateTablesInfrastructure();

var app = builder.Build();
await app.RunNexLogServiceAsync<RateTablesDbContext>(RateTablesSeed.SeedAsync);
