using Microsoft.EntityFrameworkCore;
using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.RateTables.Domain.Entities;

namespace NexLog.RateTables.Infrastructure.Persistence;

/// <summary>Owns the PostgreSQL schema "rate_tables" (database-per-service style isolation).</summary>
public sealed class RateTablesDbContext(DbContextOptions<RateTablesDbContext> options) : DbContext(options)
{
    public const string Schema = "rate_tables";
    public DbSet<RateTable> RateTables => Set<RateTable>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.HasDefaultSchema(Schema);
        b.Entity<RateTable>(e =>
        {
            e.ToTable("rate_tables");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
            e.HasIndex(x => x.Status);
        });

        b.Entity<RolePermission>(e =>
        {
            e.ToTable("role_permissions");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
        });
    }
}
