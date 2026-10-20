using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.Dashboard.Application.Dtos;
using NexLog.Dashboard.Domain.Entities;

namespace NexLog.Dashboard.Application.Services;

public interface IKpiRepository : IRepository<Kpi>;

public interface IKpiService : ICrudService<KpiDto>;

public sealed class KpiService(IKpiRepository repository) : CrudService<Kpi, KpiDto>(repository), IKpiService
{
    protected override string EntityName => "Kpi";
    protected override string IdPrefix => "KPI";
    protected override string? GetDtoId(KpiDto d) => d.Id;

    protected override KpiDto ToDto(Kpi e) => new(e.Id, e.TitleKey, e.Value, e.ChangeKey, e.ChangeParams, e.ChangePositive, e.Icon, e.Color, e.Sparkline);

    protected override void Apply(KpiDto d, Kpi e)
    {
        e.TitleKey = d.TitleKey;
        e.Value = d.Value;
        e.ChangeKey = d.ChangeKey;
        e.ChangeParams = d.ChangeParams;
        e.ChangePositive = d.ChangePositive;
        e.Icon = d.Icon;
        e.Color = d.Color;
        e.Sparkline = d.Sparkline;
    }

    protected override IQueryable<Kpi> Filter(IQueryable<Kpi> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.TitleKey.ToLower().Contains(s));
        }
        return q;
    }
}
