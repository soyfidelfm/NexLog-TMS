using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.Documents.Application.Dtos;
using NexLog.Documents.Domain.Entities;

namespace NexLog.Documents.Application.Services;

public interface IDocumentItemRepository : IRepository<DocumentItem>;

public interface IDocumentItemService : ICrudService<DocumentItemDto>;

public sealed class DocumentItemService(IDocumentItemRepository repository) : CrudService<DocumentItem, DocumentItemDto>(repository), IDocumentItemService
{
    protected override string EntityName => "DocumentItem";
    protected override string IdPrefix => "DOC";
    protected override string? GetDtoId(DocumentItemDto d) => d.Id;

    protected override DocumentItemDto ToDto(DocumentItem e) => new(e.Id, e.Type, e.Name, e.Status, e.UploadedAt, e.Size, e.Icon, e.LoadId, e.OrderId);

    protected override void Apply(DocumentItemDto d, DocumentItem e)
    {
        e.Type = d.Type;
        e.Name = d.Name;
        e.Status = d.Status;
        e.UploadedAt = d.UploadedAt;
        e.Size = d.Size;
        e.Icon = d.Icon;
        e.LoadId = d.LoadId;
        e.OrderId = d.OrderId;
    }

    protected override IQueryable<DocumentItem> Filter(IQueryable<DocumentItem> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.Name.ToLower().Contains(s) || e.Type.ToLower().Contains(s));
        }
        if (!string.IsNullOrWhiteSpace(p.Status)) q = q.Where(e => e.Status == p.Status);
        return q;
    }
}
