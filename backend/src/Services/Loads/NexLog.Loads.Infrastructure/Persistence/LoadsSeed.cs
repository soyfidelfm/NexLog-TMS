using Microsoft.EntityFrameworkCore;
using NexLog.Loads.Domain;
using NexLog.Loads.Domain.Entities;

namespace NexLog.Loads.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class LoadsSeed
{
    public static async Task SeedAsync(LoadsDbContext db)
    {
        if (!await db.Loads.AnyAsync())
        {
            db.Loads.AddRange(new List<Load>
            {
            new() { Id = "LD-2026-0842", Origin = "Dallas, TX", Destination = "Atlanta, GA", Weight = 38000m, Volume = 2400m, PickupDate = "2026-05-20", Status = "Pending", SelectedCarrier = null, CascadeCount = 0 },
            new() { Id = "LD-2026-0845", Origin = "Chicago, IL", Destination = "Detroit, MI", Weight = 22000m, Volume = 1500m, PickupDate = "2026-05-21", Status = "Accepted", SelectedCarrier = "Swift Transportation", TenderedAt = "2026-05-18T10:15:00", CascadeCount = 1 }
            });
        }

        if (!await db.Trailers.AnyAsync())
        {
            db.Trailers.AddRange(new List<Trailer>
            {
            new() { Id = "TR-53-01", Name = "53' Dry Van #01", Type = "Dry Van", MaxWeight = 45000m, MaxVolume = 3800m, Assigned = new() },
            new() { Id = "TR-48-02", Name = "48' Reefer #02", Type = "Reefer", MaxWeight = 42000m, MaxVolume = 3200m, Assigned = new() }
            });
        }

        if (!await db.PlanningOrders.AnyAsync())
        {
            db.PlanningOrders.AddRange(new List<PlanningOrder>
            {
            new() { Id = "PO-1001", Customer = "Walmart DC", Origin = "Dallas, TX", Destination = "Houston, TX", Weight = 12000m, Volume = 900m, Priority = "High" },
            new() { Id = "PO-1002", Customer = "Home Depot", Origin = "Dallas, TX", Destination = "Austin, TX", Weight = 8000m, Volume = 650m, Priority = "Medium" }
            });
        }

        await db.SaveChangesAsync();
    }
}
