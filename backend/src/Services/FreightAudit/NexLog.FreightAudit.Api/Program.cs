using NexLog.BuildingBlocks.Web.Hosting;
using NexLog.FreightAudit.Application;
using NexLog.FreightAudit.Infrastructure;
using NexLog.FreightAudit.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);
builder.AddNexLogService<FreightAuditDbContext>(FreightAuditDbContext.Schema);
builder.Services.AddFreightAuditApplication().AddFreightAuditInfrastructure();

var app = builder.Build();
await app.RunNexLogServiceAsync<FreightAuditDbContext>(FreightAuditSeed.SeedAsync);
