using Microsoft.EntityFrameworkCore;
using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.FreightAudit.Domain.Entities;

namespace NexLog.FreightAudit.Infrastructure.Persistence;

/// <summary>Owns the PostgreSQL schema "freight_audit" (database-per-service style isolation).</summary>
public sealed class FreightAuditDbContext(DbContextOptions<FreightAuditDbContext> options) : DbContext(options)
{
    public const string Schema = "freight_audit";
    public DbSet<FreightInvoice> FreightInvoices => Set<FreightInvoice>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.HasDefaultSchema(Schema);
        b.Entity<FreightInvoice>(e =>
        {
            e.ToTable("freight_invoices");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
            e.Property(x => x.Lines).HasJsonb();
            e.HasIndex(x => x.Status);
        });
    }
}
