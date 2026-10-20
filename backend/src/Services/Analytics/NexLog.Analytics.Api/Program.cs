using NexLog.BuildingBlocks.Web.Hosting;
using NexLog.Analytics.Application;
using NexLog.Analytics.Infrastructure;
using NexLog.Analytics.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);
builder.AddNexLogService<AnalyticsDbContext>(AnalyticsDbContext.Schema);
builder.Services.AddAnalyticsApplication().AddAnalyticsInfrastructure();

var app = builder.Build();
await app.RunNexLogServiceAsync<AnalyticsDbContext>(AnalyticsSeed.SeedAsync);
