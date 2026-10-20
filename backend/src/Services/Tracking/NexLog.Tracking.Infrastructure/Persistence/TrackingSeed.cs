using Microsoft.EntityFrameworkCore;
using NexLog.Tracking.Domain;
using NexLog.Tracking.Domain.Entities;

namespace NexLog.Tracking.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class TrackingSeed
{
    public static async Task SeedAsync(TrackingDbContext db)
    {
        if (!await db.Shipments.AnyAsync())
        {
            db.Shipments.AddRange(new List<Shipment>
            {
            new() { Id = "SHP-48291", OrderNumber = "ORD-2025-00124", Origin = "Monterrey, NL", Destination = "Dallas, TX", Driver = "Luis Hern\u00e1ndez", DriverPhone = "+52 81 5555 0101", Vehicle = "TRK-204", Eta = "2026-05-20T15:00:00", Status = "In Transit", Progress = 62, Color = "#3b82f6", RoutePath = "M 40 300 Q 200 120 420 90", Position = new MapPoint { X = 260, Y = 140 }, Alerts = new(), Timeline = new() { new ShipmentTimelineItem { Label = "Picked up", Time = "2026-05-18T08:10:00", Completed = true }, new ShipmentTimelineItem { Label = "Border crossing", Time = "2026-05-19T11:00:00", Completed = true, Current = true } } },
            new() { Id = "SHP-48295", OrderNumber = "ORD-2025-00123", Origin = "Chicago, IL", Destination = "Toronto, ON", Driver = "Mark Davis", DriverPhone = "+1 312 555 0199", Vehicle = "TRK-311", Eta = "2026-05-22T10:00:00", Status = "Delayed", Progress = 35, Color = "#ef4444", RoutePath = "M 60 80 L 380 40", Position = new MapPoint { X = 170, Y = 66 }, Alerts = new() { new ShipmentAlert { Type = "warning", Message = "Weather delay near Detroit" } }, Timeline = new() }
            });
        }

        await db.SaveChangesAsync();
    }
}
