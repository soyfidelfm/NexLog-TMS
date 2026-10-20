using Microsoft.EntityFrameworkCore;
using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.Loads.Domain.Entities;

namespace NexLog.Loads.Infrastructure.Persistence;

/// <summary>Owns the PostgreSQL schema "loads" (database-per-service style isolation).</summary>
public sealed class LoadsDbContext(DbContextOptions<LoadsDbContext> options) : DbContext(options)
{
    public const string Schema = "loads";
    public DbSet<Load> Loads => Set<Load>();
    public DbSet<Trailer> Trailers => Set<Trailer>();
    public DbSet<PlanningOrder> PlanningOrders => Set<PlanningOrder>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.HasDefaultSchema(Schema);
        b.Entity<Load>(e =>
        {
            e.ToTable("loads");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
            e.HasIndex(x => x.Status);
        });

        b.Entity<Trailer>(e =>
        {
            e.ToTable("trailers");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
            e.Property(x => x.Assigned).HasJsonb();
        });

        b.Entity<PlanningOrder>(e =>
        {
            e.ToTable("planning_orders");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
            e.HasIndex(x => x.Priority);
        });
    }
}
