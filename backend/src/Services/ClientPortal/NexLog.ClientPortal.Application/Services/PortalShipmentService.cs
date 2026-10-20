using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.ClientPortal.Application.Dtos;
using NexLog.ClientPortal.Domain.Entities;

namespace NexLog.ClientPortal.Application.Services;

public interface IPortalShipmentRepository : IRepository<PortalShipment>;

public interface IPortalShipmentService : ICrudService<PortalShipmentDto>;

public sealed class PortalShipmentService(IPortalShipmentRepository repository) : CrudService<PortalShipment, PortalShipmentDto>(repository), IPortalShipmentService
{
    protected override string EntityName => "PortalShipment";
    protected override string IdPrefix => "SHP";
    protected override string? GetDtoId(PortalShipmentDto d) => d.Id;

    protected override PortalShipmentDto ToDto(PortalShipment e) => new(e.Id, e.TrackingNumber, e.Origin, e.Destination, e.Status, e.Progress, e.Eta, e.Documents);

    protected override void Apply(PortalShipmentDto d, PortalShipment e)
    {
        e.TrackingNumber = d.TrackingNumber;
        e.Origin = d.Origin;
        e.Destination = d.Destination;
        e.Status = d.Status;
        e.Progress = d.Progress;
        e.Eta = d.Eta;
        e.Documents = d.Documents;
    }

    protected override IQueryable<PortalShipment> Filter(IQueryable<PortalShipment> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.TrackingNumber.ToLower().Contains(s) || e.Origin.ToLower().Contains(s) || e.Destination.ToLower().Contains(s));
        }
        if (!string.IsNullOrWhiteSpace(p.Status)) q = q.Where(e => e.Status == p.Status);
        return q;
    }
}
