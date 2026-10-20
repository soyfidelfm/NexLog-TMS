using Microsoft.EntityFrameworkCore;
using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.RouteOptimization.Domain.Entities;

namespace NexLog.RouteOptimization.Infrastructure.Persistence;

/// <summary>Owns the PostgreSQL schema "routing" (database-per-service style isolation).</summary>
public sealed class RouteOptimizationDbContext(DbContextOptions<RouteOptimizationDbContext> options) : DbContext(options)
{
    public const string Schema = "routing";
    public DbSet<OptRoute> OptRoutes => Set<OptRoute>();
    public DbSet<RouteRun> RouteRuns => Set<RouteRun>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.HasDefaultSchema(Schema);
        b.Entity<OptRoute>(e =>
        {
            e.ToTable("opt_routes");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
            e.Property(x => x.Stops).HasJsonb();
        });

        b.Entity<RouteRun>(e =>
        {
            e.ToTable("route_runs");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
            e.Property(x => x.Before).HasJsonb();
            e.Property(x => x.After).HasJsonb();
        });
    }
}
