using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.Orders.Application.Dtos;
using NexLog.Orders.Domain.Entities;

namespace NexLog.Orders.Application.Services;

public interface IOrderDetailRepository : IRepository<OrderDetail>;

public interface IOrderDetailService : ICrudService<OrderDetailDto>;

public sealed class OrderDetailService(IOrderDetailRepository repository) : CrudService<OrderDetail, OrderDetailDto>(repository), IOrderDetailService
{
    protected override string EntityName => "OrderDetail";
    protected override string IdPrefix => "ORD";
    protected override string? GetDtoId(OrderDetailDto d) => d.Id;

    protected override OrderDetailDto ToDto(OrderDetail e) => new(e.Id, e.Status, e.Origin, e.Destination, e.WeightLbs, e.WeightKg, e.Dimensions, e.ProductType, e.SpecialRequirements, e.RouteDistanceMi, e.RouteDistanceKm, e.TransitTime, e.EstimatedArrival, e.Timeline, e.Items);

    protected override void Apply(OrderDetailDto d, OrderDetail e)
    {
        e.Status = d.Status;
        e.Origin = d.Origin;
        e.Destination = d.Destination;
        e.WeightLbs = d.WeightLbs;
        e.WeightKg = d.WeightKg;
        e.Dimensions = d.Dimensions;
        e.ProductType = d.ProductType;
        e.SpecialRequirements = d.SpecialRequirements;
        e.RouteDistanceMi = d.RouteDistanceMi;
        e.RouteDistanceKm = d.RouteDistanceKm;
        e.TransitTime = d.TransitTime;
        e.EstimatedArrival = d.EstimatedArrival;
        e.Timeline = d.Timeline;
        e.Items = d.Items;
    }

    protected override IQueryable<OrderDetail> Filter(IQueryable<OrderDetail> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.Id.ToLower().Contains(s) || e.ProductType.ToLower().Contains(s));
        }
        if (!string.IsNullOrWhiteSpace(p.Status)) q = q.Where(e => e.Status == p.Status);
        return q;
    }
}
