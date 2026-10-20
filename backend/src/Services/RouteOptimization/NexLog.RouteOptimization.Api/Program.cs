using NexLog.BuildingBlocks.Web.Hosting;
using NexLog.RouteOptimization.Application;
using NexLog.RouteOptimization.Infrastructure;
using NexLog.RouteOptimization.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);
builder.AddNexLogService<RouteOptimizationDbContext>(RouteOptimizationDbContext.Schema);
builder.Services.AddRouteOptimizationApplication().AddRouteOptimizationInfrastructure();

var app = builder.Build();
await app.RunNexLogServiceAsync<RouteOptimizationDbContext>(RouteOptimizationSeed.SeedAsync);
