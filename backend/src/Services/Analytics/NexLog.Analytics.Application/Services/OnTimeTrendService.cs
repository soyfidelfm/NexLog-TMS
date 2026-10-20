using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.Analytics.Application.Dtos;
using NexLog.Analytics.Domain.Entities;

namespace NexLog.Analytics.Application.Services;

public interface IOnTimeTrendRepository : IRepository<OnTimeTrend>;

public interface IOnTimeTrendService : ICrudService<OnTimeTrendDto>;

public sealed class OnTimeTrendService(IOnTimeTrendRepository repository) : CrudService<OnTimeTrend, OnTimeTrendDto>(repository), IOnTimeTrendService
{
    protected override string EntityName => "OnTimeTrend";
    protected override string IdPrefix => "OT";
    protected override string? GetDtoId(OnTimeTrendDto d) => d.Id;

    protected override OnTimeTrendDto ToDto(OnTimeTrend e) => new(e.Id, e.Period, e.OnTimePercent, e.TotalDeliveries);

    protected override void Apply(OnTimeTrendDto d, OnTimeTrend e)
    {
        e.Period = d.Period;
        e.OnTimePercent = d.OnTimePercent;
        e.TotalDeliveries = d.TotalDeliveries;
    }

    protected override IQueryable<OnTimeTrend> Filter(IQueryable<OnTimeTrend> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.Period.ToLower().Contains(s));
        }
        return q;
    }
}
