using Microsoft.EntityFrameworkCore;
using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.Tracking.Domain.Entities;

namespace NexLog.Tracking.Infrastructure.Persistence;

/// <summary>Owns the PostgreSQL schema "tracking" (database-per-service style isolation).</summary>
public sealed class TrackingDbContext(DbContextOptions<TrackingDbContext> options) : DbContext(options)
{
    public const string Schema = "tracking";
    public DbSet<Shipment> Shipments => Set<Shipment>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.HasDefaultSchema(Schema);
        b.Entity<Shipment>(e =>
        {
            e.ToTable("shipments");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
            e.Property(x => x.Position).HasJsonb();
            e.Property(x => x.Alerts).HasJsonb();
            e.Property(x => x.Timeline).HasJsonb();
            e.HasIndex(x => x.Status);
        });
    }
}
