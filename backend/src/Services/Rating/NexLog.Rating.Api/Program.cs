using NexLog.BuildingBlocks.Web.Hosting;
using NexLog.Rating.Application;
using NexLog.Rating.Infrastructure;
using NexLog.Rating.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);
builder.AddNexLogService<RatingDbContext>(RatingDbContext.Schema);
builder.Services.AddRatingApplication().AddRatingInfrastructure();

var app = builder.Build();
await app.RunNexLogServiceAsync<RatingDbContext>(RatingSeed.SeedAsync);
