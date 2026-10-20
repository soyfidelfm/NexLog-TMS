using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.Orders.Application.Dtos;
using NexLog.Orders.Domain.Entities;

namespace NexLog.Orders.Application.Services;

public interface IOrderRepository : IRepository<Order>;

public interface IOrderService : ICrudService<OrderDto>;

public sealed class OrderService(IOrderRepository repository) : CrudService<Order, OrderDto>(repository), IOrderService
{
    protected override string EntityName => "Order";
    protected override string IdPrefix => "ORD";
    protected override string? GetDtoId(OrderDto d) => d.Id;

    protected override OrderDto ToDto(Order e) => new(e.Id, e.Origin, e.Destination, e.Weight, e.Volume, e.Status, e.Carrier, e.Eta, e.Priority);

    protected override void Apply(OrderDto d, Order e)
    {
        e.Origin = d.Origin;
        e.Destination = d.Destination;
        e.Weight = d.Weight;
        e.Volume = d.Volume;
        e.Status = d.Status;
        e.Carrier = d.Carrier;
        e.Eta = d.Eta;
        e.Priority = d.Priority;
    }

    protected override IQueryable<Order> Filter(IQueryable<Order> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.Id.ToLower().Contains(s) || e.Carrier.ToLower().Contains(s));
        }
        if (!string.IsNullOrWhiteSpace(p.Status)) q = q.Where(e => e.Status == p.Status);
        return q;
    }
}
