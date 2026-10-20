using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.Tracking.Application.Dtos;
using NexLog.Tracking.Domain.Entities;

namespace NexLog.Tracking.Application.Services;

public interface IShipmentRepository : IRepository<Shipment>;

public interface IShipmentService : ICrudService<ShipmentDto>;

public sealed class ShipmentService(IShipmentRepository repository) : CrudService<Shipment, ShipmentDto>(repository), IShipmentService
{
    protected override string EntityName => "Shipment";
    protected override string IdPrefix => "SHP";
    protected override string? GetDtoId(ShipmentDto d) => d.Id;

    protected override ShipmentDto ToDto(Shipment e) => new(e.Id, e.OrderNumber, e.Origin, e.Destination, e.Driver, e.DriverPhone, e.Vehicle, e.Eta, e.Status, e.Progress, e.Color, e.RoutePath, e.Position, e.Alerts, e.Timeline);

    protected override void Apply(ShipmentDto d, Shipment e)
    {
        e.OrderNumber = d.OrderNumber;
        e.Origin = d.Origin;
        e.Destination = d.Destination;
        e.Driver = d.Driver;
        e.DriverPhone = d.DriverPhone;
        e.Vehicle = d.Vehicle;
        e.Eta = d.Eta;
        e.Status = d.Status;
        e.Progress = d.Progress;
        e.Color = d.Color;
        e.RoutePath = d.RoutePath;
        e.Position = d.Position;
        e.Alerts = d.Alerts;
        e.Timeline = d.Timeline;
    }

    protected override IQueryable<Shipment> Filter(IQueryable<Shipment> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.Id.ToLower().Contains(s) || e.OrderNumber.ToLower().Contains(s) || e.Driver.ToLower().Contains(s));
        }
        if (!string.IsNullOrWhiteSpace(p.Status)) q = q.Where(e => e.Status == p.Status);
        return q;
    }
}
