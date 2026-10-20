using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.Documents.Application.Dtos;
using NexLog.Documents.Domain.Entities;

namespace NexLog.Documents.Application.Services;

public interface IEpodRecordRepository : IRepository<EpodRecord>;

public interface IEpodRecordService : ICrudService<EpodDto>;

public sealed class EpodRecordService(IEpodRecordRepository repository) : CrudService<EpodRecord, EpodDto>(repository), IEpodRecordService
{
    protected override string EntityName => "EpodRecord";
    protected override string IdPrefix => "POD";
    protected override string? GetDtoId(EpodDto d) => d.Id;

    protected override EpodDto ToDto(EpodRecord e) => new(e.Id, e.LoadId, e.Signature, e.PhotoUrl, e.GpsLat, e.GpsLng, e.Address, e.DeliveredAt, e.SignedBy, e.Notes);

    protected override void Apply(EpodDto d, EpodRecord e)
    {
        e.LoadId = d.LoadId;
        e.Signature = d.Signature;
        e.PhotoUrl = d.PhotoUrl;
        e.GpsLat = d.GpsLat;
        e.GpsLng = d.GpsLng;
        e.Address = d.Address;
        e.DeliveredAt = d.DeliveredAt;
        e.SignedBy = d.SignedBy;
        e.Notes = d.Notes;
    }

    protected override IQueryable<EpodRecord> Filter(IQueryable<EpodRecord> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.SignedBy.ToLower().Contains(s) || e.Address.ToLower().Contains(s));
        }
        return q;
    }
}
