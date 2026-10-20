using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.FreightAudit.Application.Services;
using NexLog.FreightAudit.Domain.Entities;

namespace NexLog.FreightAudit.Infrastructure.Persistence;

public sealed class FreightInvoiceRepository(FreightAuditDbContext db) : EfRepository<FreightInvoice, FreightAuditDbContext>(db), IFreightInvoiceRepository;
