using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.RouteOptimization.Application.Dtos;
using NexLog.RouteOptimization.Domain.Entities;

namespace NexLog.RouteOptimization.Application.Services;

public interface IRouteRunRepository : IRepository<RouteRun>;

public interface IRouteRunService : ICrudService<RouteSummaryDto>;

public sealed class RouteRunService(IRouteRunRepository repository) : CrudService<RouteRun, RouteSummaryDto>(repository), IRouteRunService
{
    protected override string EntityName => "RouteRun";
    protected override string IdPrefix => "RUN";
    protected override string? GetDtoId(RouteSummaryDto d) => d.Id;

    protected override RouteSummaryDto ToDto(RouteRun e) => new(e.Id, e.Before, e.After, e.Co2SavedKg, e.LastRun);

    protected override void Apply(RouteSummaryDto d, RouteRun e)
    {
        e.Before = d.Before;
        e.After = d.After;
        e.Co2SavedKg = d.Co2SavedKg;
        e.LastRun = d.LastRun;
    }

    protected override IQueryable<RouteRun> Filter(IQueryable<RouteRun> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.Id.ToLower().Contains(s));
        }
        return q;
    }
}
