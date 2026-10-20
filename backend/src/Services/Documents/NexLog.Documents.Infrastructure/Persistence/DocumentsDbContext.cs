using Microsoft.EntityFrameworkCore;
using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.Documents.Domain.Entities;

namespace NexLog.Documents.Infrastructure.Persistence;

/// <summary>Owns the PostgreSQL schema "documents" (database-per-service style isolation).</summary>
public sealed class DocumentsDbContext(DbContextOptions<DocumentsDbContext> options) : DbContext(options)
{
    public const string Schema = "documents";
    public DbSet<DocumentItem> DocumentItems => Set<DocumentItem>();
    public DbSet<EpodRecord> EpodRecords => Set<EpodRecord>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.HasDefaultSchema(Schema);
        b.Entity<DocumentItem>(e =>
        {
            e.ToTable("document_items");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
            e.HasIndex(x => x.Status);
        });

        b.Entity<EpodRecord>(e =>
        {
            e.ToTable("epod_records");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
        });
    }
}
