using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.Loads.Application.Dtos;
using NexLog.Loads.Domain.Entities;

namespace NexLog.Loads.Application.Services;

public interface IPlanningOrderRepository : IRepository<PlanningOrder>;

public interface IPlanningOrderService : ICrudService<PlanningOrderDto>;

public sealed class PlanningOrderService(IPlanningOrderRepository repository) : CrudService<PlanningOrder, PlanningOrderDto>(repository), IPlanningOrderService
{
    protected override string EntityName => "PlanningOrder";
    protected override string IdPrefix => "PO";
    protected override string? GetDtoId(PlanningOrderDto d) => d.Id;

    protected override PlanningOrderDto ToDto(PlanningOrder e) => new(e.Id, e.Customer, e.Origin, e.Destination, e.Weight, e.Volume, e.Priority);

    protected override void Apply(PlanningOrderDto d, PlanningOrder e)
    {
        e.Customer = d.Customer;
        e.Origin = d.Origin;
        e.Destination = d.Destination;
        e.Weight = d.Weight;
        e.Volume = d.Volume;
        e.Priority = d.Priority;
    }

    protected override IQueryable<PlanningOrder> Filter(IQueryable<PlanningOrder> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.Id.ToLower().Contains(s) || e.Customer.ToLower().Contains(s));
        }
        if (!string.IsNullOrWhiteSpace(p.Status)) q = q.Where(e => e.Priority == p.Status);
        return q;
    }
}
