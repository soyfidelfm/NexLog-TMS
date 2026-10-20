using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.RateTables.Application.Dtos;
using NexLog.RateTables.Domain.Entities;

namespace NexLog.RateTables.Application.Services;

public interface IRateTableRepository : IRepository<RateTable>;

public interface IRateTableService : ICrudService<RateTableDto>;

public sealed class RateTableService(IRateTableRepository repository) : CrudService<RateTable, RateTableDto>(repository), IRateTableService
{
    protected override string EntityName => "RateTable";
    protected override string IdPrefix => "RT";
    protected override string? GetDtoId(RateTableDto d) => d.Id;

    protected override RateTableDto ToDto(RateTable e) => new(e.Id, e.Name, e.Carrier, e.OriginZone, e.DestinationZone, e.Mode, e.RateType, e.BaseRate, e.MinCharge, e.FuelSurcharge, e.EffectiveFrom, e.EffectiveTo, e.Status);

    protected override void Apply(RateTableDto d, RateTable e)
    {
        e.Name = d.Name;
        e.Carrier = d.Carrier;
        e.OriginZone = d.OriginZone;
        e.DestinationZone = d.DestinationZone;
        e.Mode = d.Mode;
        e.RateType = d.RateType;
        e.BaseRate = d.BaseRate;
        e.MinCharge = d.MinCharge;
        e.FuelSurcharge = d.FuelSurcharge;
        e.EffectiveFrom = d.EffectiveFrom;
        e.EffectiveTo = d.EffectiveTo;
        e.Status = d.Status;
    }

    protected override IQueryable<RateTable> Filter(IQueryable<RateTable> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.Name.ToLower().Contains(s) || e.Carrier.ToLower().Contains(s));
        }
        if (!string.IsNullOrWhiteSpace(p.Status)) q = q.Where(e => e.Status == p.Status);
        return q;
    }
}
