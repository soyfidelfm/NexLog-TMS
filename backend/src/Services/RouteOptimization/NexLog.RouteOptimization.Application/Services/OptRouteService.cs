using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.RouteOptimization.Application.Dtos;
using NexLog.RouteOptimization.Domain.Entities;

namespace NexLog.RouteOptimization.Application.Services;

public interface IOptRouteRepository : IRepository<OptRoute>;

public interface IOptRouteService : ICrudService<OptRouteDto>;

public sealed class OptRouteService(IOptRouteRepository repository) : CrudService<OptRoute, OptRouteDto>(repository), IOptRouteService
{
    protected override string EntityName => "OptRoute";
    protected override string IdPrefix => "R";
    protected override string? GetDtoId(OptRouteDto d) => d.Id;

    protected override OptRouteDto ToDto(OptRoute e) => new(e.Id, e.Name, e.Color, e.Vehicle, e.Driver, e.DistanceKm, e.DurationMin, e.Cost, e.LoadPct, e.Stops);

    protected override void Apply(OptRouteDto d, OptRoute e)
    {
        e.Name = d.Name;
        e.Color = d.Color;
        e.Vehicle = d.Vehicle;
        e.Driver = d.Driver;
        e.DistanceKm = d.DistanceKm;
        e.DurationMin = d.DurationMin;
        e.Cost = d.Cost;
        e.LoadPct = d.LoadPct;
        e.Stops = d.Stops;
    }

    protected override IQueryable<OptRoute> Filter(IQueryable<OptRoute> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.Name.ToLower().Contains(s) || e.Driver.ToLower().Contains(s) || e.Vehicle.ToLower().Contains(s));
        }
        return q;
    }
}
