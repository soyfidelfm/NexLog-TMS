using NexLog.BuildingBlocks.Web.Hosting;
using NexLog.Tendering.Application;
using NexLog.Tendering.Infrastructure;
using NexLog.Tendering.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);
builder.AddNexLogService<TenderingDbContext>(TenderingDbContext.Schema);
builder.Services.AddTenderingApplication().AddTenderingInfrastructure();

var app = builder.Build();
await app.RunNexLogServiceAsync<TenderingDbContext>(TenderingSeed.SeedAsync);
