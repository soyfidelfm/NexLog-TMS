using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.RouteOptimization.Application.Services;
using NexLog.RouteOptimization.Domain.Entities;

namespace NexLog.RouteOptimization.Infrastructure.Persistence;

public sealed class OptRouteRepository(RouteOptimizationDbContext db) : EfRepository<OptRoute, RouteOptimizationDbContext>(db), IOptRouteRepository;

public sealed class RouteRunRepository(RouteOptimizationDbContext db) : EfRepository<RouteRun, RouteOptimizationDbContext>(db), IRouteRunRepository;
