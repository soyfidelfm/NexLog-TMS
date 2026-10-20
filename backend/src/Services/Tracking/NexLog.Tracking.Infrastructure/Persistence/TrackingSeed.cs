using Microsoft.EntityFrameworkCore;
using NexLog.Tracking.Domain;
using NexLog.Tracking.Domain.Entities;

namespace NexLog.Tracking.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class TrackingSeed
{
    private static readonly System.Text.Json.JsonSerializerOptions Json = new(System.Text.Json.JsonSerializerDefaults.Web);

    /// <summary>Reads an embedded SeedData/*.json file (exported from the Angular mocks).</summary>
    private static List<T> Load<T>(string file)
    {
        var asm = typeof(TrackingSeed).Assembly;
        var name = asm.GetManifestResourceNames().Single(n => n.EndsWith("SeedData." + file));
        using var stream = asm.GetManifestResourceStream(name)!;
        return System.Text.Json.JsonSerializer.Deserialize<List<T>>(stream, Json) ?? [];
    }

    public static async Task SeedAsync(TrackingDbContext db)
    {
        if (!await db.Shipments.AnyAsync())
            db.Shipments.AddRange(Load<Shipment>("Shipment.json"));

        await db.SaveChangesAsync();
    }
}
