using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.Tendering.Application.Dtos;
using NexLog.Tendering.Domain.Entities;

namespace NexLog.Tendering.Application.Services;

public interface ITenderRepository : IRepository<Tender>;

public interface ITenderService : ICrudService<TenderDto>;

public sealed class TenderService(ITenderRepository repository) : CrudService<Tender, TenderDto>(repository), ITenderService
{
    protected override string EntityName => "Tender";
    protected override string IdPrefix => "TD";
    protected override string? GetDtoId(TenderDto d) => d.Id;

    protected override TenderDto ToDto(Tender e) => new(e.Id, e.LoadId, e.Origin, e.Destination, e.Weight, e.Volume, e.PickupDate, e.Status, e.SelectedCarrier, e.TenderedAt, e.CascadeCount, e.CarrierSequence);

    protected override void Apply(TenderDto d, Tender e)
    {
        e.LoadId = d.LoadId;
        e.Origin = d.Origin;
        e.Destination = d.Destination;
        e.Weight = d.Weight;
        e.Volume = d.Volume;
        e.PickupDate = d.PickupDate;
        e.Status = d.Status;
        e.SelectedCarrier = d.SelectedCarrier;
        e.TenderedAt = d.TenderedAt;
        e.CascadeCount = d.CascadeCount;
        e.CarrierSequence = d.CarrierSequence;
    }

    protected override IQueryable<Tender> Filter(IQueryable<Tender> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.LoadId.ToLower().Contains(s) || e.Origin.ToLower().Contains(s) || e.Destination.ToLower().Contains(s));
        }
        if (!string.IsNullOrWhiteSpace(p.Status)) q = q.Where(e => e.Status == p.Status);
        return q;
    }
}
