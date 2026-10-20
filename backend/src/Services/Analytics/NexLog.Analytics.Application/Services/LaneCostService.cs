using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.Analytics.Application.Dtos;
using NexLog.Analytics.Domain.Entities;

namespace NexLog.Analytics.Application.Services;

public interface ILaneCostRepository : IRepository<LaneCost>;

public interface ILaneCostService : ICrudService<LaneCostDto>;

public sealed class LaneCostService(ILaneCostRepository repository) : CrudService<LaneCost, LaneCostDto>(repository), ILaneCostService
{
    protected override string EntityName => "LaneCost";
    protected override string IdPrefix => "LC";
    protected override string? GetDtoId(LaneCostDto d) => d.Id;

    protected override LaneCostDto ToDto(LaneCost e) => new(e.Id, e.Lane, e.Origin, e.Destination, e.AvgCost, e.TotalCost, e.Volume, e.Mode);

    protected override void Apply(LaneCostDto d, LaneCost e)
    {
        e.Lane = d.Lane;
        e.Origin = d.Origin;
        e.Destination = d.Destination;
        e.AvgCost = d.AvgCost;
        e.TotalCost = d.TotalCost;
        e.Volume = d.Volume;
        e.Mode = d.Mode;
    }

    protected override IQueryable<LaneCost> Filter(IQueryable<LaneCost> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.Lane.ToLower().Contains(s) || e.Mode.ToLower().Contains(s));
        }
        return q;
    }
}
