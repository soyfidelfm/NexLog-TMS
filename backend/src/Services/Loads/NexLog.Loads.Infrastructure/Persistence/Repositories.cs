using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.Loads.Application.Services;
using NexLog.Loads.Domain.Entities;

namespace NexLog.Loads.Infrastructure.Persistence;

public sealed class LoadRepository(LoadsDbContext db) : EfRepository<Load, LoadsDbContext>(db), ILoadRepository;

public sealed class TrailerRepository(LoadsDbContext db) : EfRepository<Trailer, LoadsDbContext>(db), ITrailerRepository;

public sealed class PlanningOrderRepository(LoadsDbContext db) : EfRepository<PlanningOrder, LoadsDbContext>(db), IPlanningOrderRepository;
