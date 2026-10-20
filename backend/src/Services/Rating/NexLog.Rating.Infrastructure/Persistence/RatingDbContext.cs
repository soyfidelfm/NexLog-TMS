using Microsoft.EntityFrameworkCore;
using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.Rating.Domain.Entities;

namespace NexLog.Rating.Infrastructure.Persistence;

/// <summary>Owns the PostgreSQL schema "rating" (database-per-service style isolation).</summary>
public sealed class RatingDbContext(DbContextOptions<RatingDbContext> options) : DbContext(options)
{
    public const string Schema = "rating";
    public DbSet<CarrierQuote> CarrierQuotes => Set<CarrierQuote>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.HasDefaultSchema(Schema);
        b.Entity<CarrierQuote>(e =>
        {
            e.ToTable("carrier_quotes");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
        });
    }
}
