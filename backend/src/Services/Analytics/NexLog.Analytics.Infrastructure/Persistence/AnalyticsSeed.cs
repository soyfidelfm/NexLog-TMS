using Microsoft.EntityFrameworkCore;
using NexLog.Analytics.Domain;
using NexLog.Analytics.Domain.Entities;

namespace NexLog.Analytics.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class AnalyticsSeed
{
    public static async Task SeedAsync(AnalyticsDbContext db)
    {
        if (!await db.LaneCosts.AnyAsync())
        {
            db.LaneCosts.AddRange(new List<LaneCost>
            {
            new() { Id = "LC-1", Lane = "DAL-ATL", Origin = "Dallas", Destination = "Atlanta", AvgCost = 1980m, TotalCost = 95040m, Volume = 48, Mode = "FTL" },
            new() { Id = "LC-2", Lane = "CHI-DET", Origin = "Chicago", Destination = "Detroit", AvgCost = 890m, TotalCost = 32040m, Volume = 36, Mode = "LTL" }
            });
        }

        if (!await db.CarrierPerformances.AnyAsync())
        {
            db.CarrierPerformances.AddRange(new List<CarrierPerformance>
            {
            new() { Id = "CP-1", Carrier = "Swift Transportation", OnTimePercent = 96.2m, AvgCost = 1850m, TotalVolume = 420, Claims = 2, Score = 94m },
            new() { Id = "CP-2", Carrier = "Schneider National", OnTimePercent = 94.8m, AvgCost = 1720m, TotalVolume = 355, Claims = 3, Score = 90m }
            });
        }

        if (!await db.OnTimeTrends.AnyAsync())
        {
            db.OnTimeTrends.AddRange(new List<OnTimeTrend>
            {
            new() { Id = "OT-2026-04", Period = "2026-04", OnTimePercent = 93.1m, TotalDeliveries = 1180 },
            new() { Id = "OT-2026-05", Period = "2026-05", OnTimePercent = 95.4m, TotalDeliveries = 1265 }
            });
        }

        if (!await db.ModeVolumes.AnyAsync())
        {
            db.ModeVolumes.AddRange(new List<ModeVolume>
            {
            new() { Id = "MV-FTL", Mode = "FTL", Volume = 620, Percentage = 52m, Cost = 1150000m },
            new() { Id = "MV-LTL", Mode = "LTL", Volume = 410, Percentage = 34m, Cost = 380000m },
            new() { Id = "MV-INT", Mode = "Intermodal", Volume = 165, Percentage = 14m, Cost = 210000m }
            });
        }

        await db.SaveChangesAsync();
    }
}
