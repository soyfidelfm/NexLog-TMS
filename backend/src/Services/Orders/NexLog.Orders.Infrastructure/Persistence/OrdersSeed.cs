using Microsoft.EntityFrameworkCore;
using NexLog.Orders.Domain;
using NexLog.Orders.Domain.Entities;

namespace NexLog.Orders.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class OrdersSeed
{
    public static async Task SeedAsync(OrdersDbContext db)
    {
        if (!await db.Orders.AnyAsync())
        {
            db.Orders.AddRange(new List<Order>
            {
            new() { Id = "ORD-2025-00125", Origin = new OrderOriginDest { City = "Shanghai", Country = "CN", Flag = "🇨🇳" }, Destination = new OrderOriginDest { City = "Los Angeles", Country = "US", Flag = "🇺🇸" }, Weight = 12500m, Volume = 38.5m, Status = "Delivered", Carrier = "Maersk Line", Eta = "2025-05-18", Priority = "High" },
            new() { Id = "ORD-2025-00124", Origin = new OrderOriginDest { City = "Monterrey", Country = "MX", Flag = "🇲🇽" }, Destination = new OrderOriginDest { City = "Dallas", Country = "US", Flag = "🇺🇸" }, Weight = 8400m, Volume = 22m, Status = "In Transit", Carrier = "Swift Transportation", Eta = "2025-05-20", Priority = "Medium" },
            new() { Id = "ORD-2025-00123", Origin = new OrderOriginDest { City = "Chicago", Country = "US", Flag = "🇺🇸" }, Destination = new OrderOriginDest { City = "Toronto", Country = "CA", Flag = "🇨🇦" }, Weight = 5200m, Volume = 14.2m, Status = "Delayed", Carrier = "Schneider National", Eta = "2025-05-22", Priority = "Low" }
            });
        }

        if (!await db.OrderDetails.AnyAsync())
        {
            db.OrderDetails.AddRange(new List<OrderDetail>
            {
            new() { Id = "ORD-2025-00124", Status = "in-transit", Origin = new OrderDetailOrigin { City = "Monterrey, NL", Address = "Av. Industrial 450", Zip = "64000", Date = "2025-05-16", Window = "08:00 - 12:00" }, Destination = new OrderDetailOrigin { City = "Dallas, TX", Address = "2200 Commerce St", Zip = "75201", Date = "2025-05-20", Window = "09:00 - 17:00" }, WeightLbs = 8400m, WeightKg = 3810m, Dimensions = new OrderDimensions { LengthFt = 48, WidthFt = 8.5m, HeightFt = 9, LengthM = 14.6m, WidthM = 2.6m, HeightM = 2.7m }, ProductType = "Auto parts", SpecialRequirements = new() { "Liftgate", "Hazmat: No" }, RouteDistanceMi = 440m, RouteDistanceKm = 708m, TransitTime = "2d 6h", EstimatedArrival = "2025-05-20T15:00:00", Timeline = new() { new OrderTimelineStep { Label = "order-created", Date = "2025-05-14T10:00:00", Completed = true }, new OrderTimelineStep { Label = "confirmed", Date = "2025-05-15T09:30:00", Completed = true }, new OrderTimelineStep { Label = "in-transit", Date = "2025-05-16T12:00:00", Completed = true, Current = true }, new OrderTimelineStep { Label = "delivered", Date = "2025-05-20T15:00:00", Estimated = true } }, Items = new() { new OrderItem { Sku = "AP-1001", Description = "Brake assemblies", Quantity = 120, WeightLbs = 4200 }, new OrderItem { Sku = "AP-2040", Description = "Alternators", Quantity = 80, WeightLbs = 4200 } } }
            });
        }

        await db.SaveChangesAsync();
    }
}
