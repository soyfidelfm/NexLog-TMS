using NexLog.BuildingBlocks.Web.Hosting;
using NexLog.Carriers.Application;
using NexLog.Carriers.Infrastructure;
using NexLog.Carriers.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);
builder.AddNexLogService<CarriersDbContext>(CarriersDbContext.Schema);
builder.Services.AddCarriersApplication().AddCarriersInfrastructure();

var app = builder.Build();
await app.RunNexLogServiceAsync<CarriersDbContext>(CarriersSeed.SeedAsync);
