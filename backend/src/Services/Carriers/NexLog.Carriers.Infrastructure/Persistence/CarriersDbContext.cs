using Microsoft.EntityFrameworkCore;
using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.Carriers.Domain.Entities;

namespace NexLog.Carriers.Infrastructure.Persistence;

/// <summary>Owns the PostgreSQL schema "carriers" (database-per-service style isolation).</summary>
public sealed class CarriersDbContext(DbContextOptions<CarriersDbContext> options) : DbContext(options)
{
    public const string Schema = "carriers";
    public DbSet<Carrier> Carriers => Set<Carrier>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.HasDefaultSchema(Schema);
        b.Entity<Carrier>(e =>
        {
            e.ToTable("carriers");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
            e.HasIndex(x => x.Status);
        });
    }
}
