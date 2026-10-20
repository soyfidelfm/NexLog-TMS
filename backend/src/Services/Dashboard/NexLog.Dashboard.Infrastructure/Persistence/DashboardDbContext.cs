using Microsoft.EntityFrameworkCore;
using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.Dashboard.Domain.Entities;

namespace NexLog.Dashboard.Infrastructure.Persistence;

/// <summary>Owns the PostgreSQL schema "dashboard" (database-per-service style isolation).</summary>
public sealed class DashboardDbContext(DbContextOptions<DashboardDbContext> options) : DbContext(options)
{
    public const string Schema = "dashboard";
    public DbSet<Kpi> Kpis => Set<Kpi>();
    public DbSet<DashboardAlert> DashboardAlerts => Set<DashboardAlert>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.HasDefaultSchema(Schema);
        b.Entity<Kpi>(e =>
        {
            e.ToTable("kpis");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
            e.Property(x => x.ChangeParams).HasJsonb();
            e.Property(x => x.Sparkline).HasJsonb();
        });

        b.Entity<DashboardAlert>(e =>
        {
            e.ToTable("dashboard_alerts");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
            e.HasIndex(x => x.Type);
        });
    }
}
