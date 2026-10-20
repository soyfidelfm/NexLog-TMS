using NexLog.BuildingBlocks.Web.Hosting;
using NexLog.Dashboard.Application;
using NexLog.Dashboard.Infrastructure;
using NexLog.Dashboard.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);
builder.AddNexLogService<DashboardDbContext>(DashboardDbContext.Schema);
builder.Services.AddDashboardApplication().AddDashboardInfrastructure();

var app = builder.Build();
await app.RunNexLogServiceAsync<DashboardDbContext>(DashboardSeed.SeedAsync);
