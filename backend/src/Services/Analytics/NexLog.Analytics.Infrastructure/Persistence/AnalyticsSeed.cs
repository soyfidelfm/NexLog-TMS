using Microsoft.EntityFrameworkCore;
using NexLog.Analytics.Domain;
using NexLog.Analytics.Domain.Entities;

namespace NexLog.Analytics.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class AnalyticsSeed
{
    private static readonly System.Text.Json.JsonSerializerOptions Json = new(System.Text.Json.JsonSerializerDefaults.Web);

    /// <summary>Reads an embedded SeedData/*.json file (exported from the Angular mocks).</summary>
    private static List<T> Load<T>(string file)
    {
        var asm = typeof(AnalyticsSeed).Assembly;
        var name = asm.GetManifestResourceNames().Single(n => n.EndsWith("SeedData." + file));
        using var stream = asm.GetManifestResourceStream(name)!;
        return System.Text.Json.JsonSerializer.Deserialize<List<T>>(stream, Json) ?? [];
    }

    public static async Task SeedAsync(AnalyticsDbContext db)
    {
        if (!await db.LaneCosts.AnyAsync())
            db.LaneCosts.AddRange(Load<LaneCost>("LaneCost.json"));

        if (!await db.CarrierPerformances.AnyAsync())
            db.CarrierPerformances.AddRange(Load<CarrierPerformance>("CarrierPerformance.json"));

        if (!await db.OnTimeTrends.AnyAsync())
            db.OnTimeTrends.AddRange(Load<OnTimeTrend>("OnTimeTrend.json"));

        if (!await db.ModeVolumes.AnyAsync())
            db.ModeVolumes.AddRange(Load<ModeVolume>("ModeVolume.json"));

        await db.SaveChangesAsync();
    }
}
