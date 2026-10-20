using NexLog.BuildingBlocks.Web.Hosting;
using NexLog.ClientPortal.Application;
using NexLog.ClientPortal.Infrastructure;
using NexLog.ClientPortal.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);
builder.AddNexLogService<ClientPortalDbContext>(ClientPortalDbContext.Schema);
builder.Services.AddClientPortalApplication().AddClientPortalInfrastructure();

var app = builder.Build();
await app.RunNexLogServiceAsync<ClientPortalDbContext>(ClientPortalSeed.SeedAsync);
