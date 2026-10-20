using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.Dashboard.Application.Dtos;
using NexLog.Dashboard.Domain.Entities;

namespace NexLog.Dashboard.Application.Services;

public interface IDashboardAlertRepository : IRepository<DashboardAlert>;

public interface IDashboardAlertService : ICrudService<AlertDto>;

public sealed class DashboardAlertService(IDashboardAlertRepository repository) : CrudService<DashboardAlert, AlertDto>(repository), IDashboardAlertService
{
    protected override string EntityName => "DashboardAlert";
    protected override string IdPrefix => "AL";
    protected override string? GetDtoId(AlertDto d) => d.Id;

    protected override AlertDto ToDto(DashboardAlert e) => new(e.Id, e.Type, e.TitleKey, e.DescKey, e.TimeKey, e.N, e.Icon, e.Color);

    protected override void Apply(AlertDto d, DashboardAlert e)
    {
        e.Type = d.Type;
        e.TitleKey = d.TitleKey;
        e.DescKey = d.DescKey;
        e.TimeKey = d.TimeKey;
        e.N = d.N;
        e.Icon = d.Icon;
        e.Color = d.Color;
    }

    protected override IQueryable<DashboardAlert> Filter(IQueryable<DashboardAlert> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.TitleKey.ToLower().Contains(s));
        }
        if (!string.IsNullOrWhiteSpace(p.Status)) q = q.Where(e => e.Type == p.Status);
        return q;
    }
}
