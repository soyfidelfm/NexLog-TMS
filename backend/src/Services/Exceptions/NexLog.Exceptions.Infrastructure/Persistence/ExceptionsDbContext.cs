using Microsoft.EntityFrameworkCore;
using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.Exceptions.Domain.Entities;

namespace NexLog.Exceptions.Infrastructure.Persistence;

/// <summary>Owns the PostgreSQL schema "exceptions" (database-per-service style isolation).</summary>
public sealed class ExceptionsDbContext(DbContextOptions<ExceptionsDbContext> options) : DbContext(options)
{
    public const string Schema = "exceptions";
    public DbSet<ExceptionCase> ExceptionCases => Set<ExceptionCase>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.HasDefaultSchema(Schema);
        b.Entity<ExceptionCase>(e =>
        {
            e.ToTable("exception_cases");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
            e.Property(x => x.Timeline).HasJsonb();
            e.Property(x => x.Actions).HasJsonb();
            e.Property(x => x.Communications).HasJsonb();
            e.HasIndex(x => x.Status);
        });
    }
}
