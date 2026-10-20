using NexLog.BuildingBlocks.Web.Hosting;
using NexLog.Orders.Application;
using NexLog.Orders.Infrastructure;
using NexLog.Orders.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);
builder.AddNexLogService<OrdersDbContext>(OrdersDbContext.Schema);
builder.Services.AddOrdersApplication().AddOrdersInfrastructure();

var app = builder.Build();
await app.RunNexLogServiceAsync<OrdersDbContext>(OrdersSeed.SeedAsync);
