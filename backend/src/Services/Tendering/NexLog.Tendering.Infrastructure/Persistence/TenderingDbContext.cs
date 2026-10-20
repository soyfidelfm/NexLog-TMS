using Microsoft.EntityFrameworkCore;
using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.Tendering.Domain.Entities;

namespace NexLog.Tendering.Infrastructure.Persistence;

/// <summary>Owns the PostgreSQL schema "tendering" (database-per-service style isolation).</summary>
public sealed class TenderingDbContext(DbContextOptions<TenderingDbContext> options) : DbContext(options)
{
    public const string Schema = "tendering";
    public DbSet<Tender> Tenders => Set<Tender>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.HasDefaultSchema(Schema);
        b.Entity<Tender>(e =>
        {
            e.ToTable("tenders");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
            e.HasIndex(x => x.Status);
        });
    }
}
