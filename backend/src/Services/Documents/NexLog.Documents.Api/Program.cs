using NexLog.BuildingBlocks.Web.Hosting;
using NexLog.Documents.Application;
using NexLog.Documents.Infrastructure;
using NexLog.Documents.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);
builder.AddNexLogService<DocumentsDbContext>(DocumentsDbContext.Schema);
builder.Services.AddDocumentsApplication().AddDocumentsInfrastructure();

var app = builder.Build();
await app.RunNexLogServiceAsync<DocumentsDbContext>(DocumentsSeed.SeedAsync);
