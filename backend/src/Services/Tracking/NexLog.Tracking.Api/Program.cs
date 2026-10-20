using NexLog.BuildingBlocks.Web.Hosting;
using NexLog.Tracking.Application;
using NexLog.Tracking.Infrastructure;
using NexLog.Tracking.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);
builder.AddNexLogService<TrackingDbContext>(TrackingDbContext.Schema);
builder.Services.AddTrackingApplication().AddTrackingInfrastructure();

var app = builder.Build();
await app.RunNexLogServiceAsync<TrackingDbContext>(TrackingSeed.SeedAsync);
