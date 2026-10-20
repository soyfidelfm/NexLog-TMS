using Microsoft.EntityFrameworkCore;
using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.Orders.Domain.Entities;

namespace NexLog.Orders.Infrastructure.Persistence;

/// <summary>Owns the PostgreSQL schema "orders" (database-per-service style isolation).</summary>
public sealed class OrdersDbContext(DbContextOptions<OrdersDbContext> options) : DbContext(options)
{
    public const string Schema = "orders";
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderDetail> OrderDetails => Set<OrderDetail>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.HasDefaultSchema(Schema);
        b.Entity<Order>(e =>
        {
            e.ToTable("orders");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
            e.Property(x => x.Origin).HasJsonb();
            e.Property(x => x.Destination).HasJsonb();
            e.HasIndex(x => x.Status);
        });

        b.Entity<OrderDetail>(e =>
        {
            e.ToTable("order_details");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
            e.Property(x => x.Origin).HasJsonb();
            e.Property(x => x.Destination).HasJsonb();
            e.Property(x => x.Dimensions).HasJsonb();
            e.Property(x => x.Timeline).HasJsonb();
            e.Property(x => x.Items).HasJsonb();
            e.HasIndex(x => x.Status);
        });
    }
}
