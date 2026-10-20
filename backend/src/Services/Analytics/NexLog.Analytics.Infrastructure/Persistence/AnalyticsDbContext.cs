using Microsoft.EntityFrameworkCore;
using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.Analytics.Domain.Entities;

namespace NexLog.Analytics.Infrastructure.Persistence;

/// <summary>Owns the PostgreSQL schema "analytics" (database-per-service style isolation).</summary>
public sealed class AnalyticsDbContext(DbContextOptions<AnalyticsDbContext> options) : DbContext(options)
{
    public const string Schema = "analytics";
    public DbSet<LaneCost> LaneCosts => Set<LaneCost>();
    public DbSet<CarrierPerformance> CarrierPerformances => Set<CarrierPerformance>();
    public DbSet<OnTimeTrend> OnTimeTrends => Set<OnTimeTrend>();
    public DbSet<ModeVolume> ModeVolumes => Set<ModeVolume>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.HasDefaultSchema(Schema);
        b.Entity<LaneCost>(e =>
        {
            e.ToTable("lane_costs");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
        });

        b.Entity<CarrierPerformance>(e =>
        {
            e.ToTable("carrier_performances");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
        });

        b.Entity<OnTimeTrend>(e =>
        {
            e.ToTable("on_time_trends");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
        });

        b.Entity<ModeVolume>(e =>
        {
            e.ToTable("mode_volumes");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
        });
    }
}
