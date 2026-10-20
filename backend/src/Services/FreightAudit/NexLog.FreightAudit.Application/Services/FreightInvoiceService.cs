using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.FreightAudit.Application.Dtos;
using NexLog.FreightAudit.Domain.Entities;

namespace NexLog.FreightAudit.Application.Services;

public interface IFreightInvoiceRepository : IRepository<FreightInvoice>;

public interface IFreightInvoiceService : ICrudService<FreightInvoiceDto>;

public sealed class FreightInvoiceService(IFreightInvoiceRepository repository) : CrudService<FreightInvoice, FreightInvoiceDto>(repository), IFreightInvoiceService
{
    protected override string EntityName => "FreightInvoice";
    protected override string IdPrefix => "INV";
    protected override string? GetDtoId(FreightInvoiceDto d) => d.Id;

    protected override FreightInvoiceDto ToDto(FreightInvoice e) => new(e.Id, e.Carrier, e.LoadId, e.InvoiceDate, e.Status, e.Lines);

    protected override void Apply(FreightInvoiceDto d, FreightInvoice e)
    {
        e.Carrier = d.Carrier;
        e.LoadId = d.LoadId;
        e.InvoiceDate = d.InvoiceDate;
        e.Status = d.Status;
        e.Lines = d.Lines;
    }

    protected override IQueryable<FreightInvoice> Filter(IQueryable<FreightInvoice> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.Id.ToLower().Contains(s) || e.Carrier.ToLower().Contains(s) || e.LoadId.ToLower().Contains(s));
        }
        if (!string.IsNullOrWhiteSpace(p.Status)) q = q.Where(e => e.Status == p.Status);
        return q;
    }
}
