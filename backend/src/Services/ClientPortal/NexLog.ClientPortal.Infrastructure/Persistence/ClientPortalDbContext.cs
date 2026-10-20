using Microsoft.EntityFrameworkCore;
using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.ClientPortal.Domain.Entities;

namespace NexLog.ClientPortal.Infrastructure.Persistence;

/// <summary>Owns the PostgreSQL schema "client_portal" (database-per-service style isolation).</summary>
public sealed class ClientPortalDbContext(DbContextOptions<ClientPortalDbContext> options) : DbContext(options)
{
    public const string Schema = "client_portal";
    public DbSet<PortalShipment> PortalShipments => Set<PortalShipment>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.HasDefaultSchema(Schema);
        b.Entity<PortalShipment>(e =>
        {
            e.ToTable("portal_shipments");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
            e.Property(x => x.Documents).HasJsonb();
            e.HasIndex(x => x.Status);
        });
    }
}
