using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.Analytics.Application.Dtos;
using NexLog.Analytics.Domain.Entities;

namespace NexLog.Analytics.Application.Services;

public interface ICarrierPerformanceRepository : IRepository<CarrierPerformance>;

public interface ICarrierPerformanceService : ICrudService<CarrierPerformanceDto>;

public sealed class CarrierPerformanceService(ICarrierPerformanceRepository repository) : CrudService<CarrierPerformance, CarrierPerformanceDto>(repository), ICarrierPerformanceService
{
    protected override string EntityName => "CarrierPerformance";
    protected override string IdPrefix => "CP";
    protected override string? GetDtoId(CarrierPerformanceDto d) => d.Id;

    protected override CarrierPerformanceDto ToDto(CarrierPerformance e) => new(e.Id, e.Carrier, e.OnTimePercent, e.AvgCost, e.TotalVolume, e.Claims, e.Score);

    protected override void Apply(CarrierPerformanceDto d, CarrierPerformance e)
    {
        e.Carrier = d.Carrier;
        e.OnTimePercent = d.OnTimePercent;
        e.AvgCost = d.AvgCost;
        e.TotalVolume = d.TotalVolume;
        e.Claims = d.Claims;
        e.Score = d.Score;
    }

    protected override IQueryable<CarrierPerformance> Filter(IQueryable<CarrierPerformance> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.Carrier.ToLower().Contains(s));
        }
        return q;
    }
}
