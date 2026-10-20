using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.Loads.Application.Dtos;
using NexLog.Loads.Domain.Entities;

namespace NexLog.Loads.Application.Services;

public interface ILoadRepository : IRepository<Load>;

public interface ILoadService : ICrudService<LoadDto>;

public sealed class LoadService(ILoadRepository repository) : CrudService<Load, LoadDto>(repository), ILoadService
{
    protected override string EntityName => "Load";
    protected override string IdPrefix => "LD";
    protected override string? GetDtoId(LoadDto d) => d.Id;

    protected override LoadDto ToDto(Load e) => new(e.Id, e.Origin, e.Destination, e.Weight, e.Volume, e.PickupDate, e.Status, e.SelectedCarrier, e.TenderedAt, e.CascadeCount);

    protected override void Apply(LoadDto d, Load e)
    {
        e.Origin = d.Origin;
        e.Destination = d.Destination;
        e.Weight = d.Weight;
        e.Volume = d.Volume;
        e.PickupDate = d.PickupDate;
        e.Status = d.Status;
        e.SelectedCarrier = d.SelectedCarrier;
        e.TenderedAt = d.TenderedAt;
        e.CascadeCount = d.CascadeCount;
    }

    protected override IQueryable<Load> Filter(IQueryable<Load> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.Id.ToLower().Contains(s) || e.Origin.ToLower().Contains(s) || e.Destination.ToLower().Contains(s));
        }
        if (!string.IsNullOrWhiteSpace(p.Status)) q = q.Where(e => e.Status == p.Status);
        return q;
    }
}
