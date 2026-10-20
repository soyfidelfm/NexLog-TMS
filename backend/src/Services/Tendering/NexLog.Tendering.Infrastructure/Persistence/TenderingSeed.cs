using Microsoft.EntityFrameworkCore;
using NexLog.Tendering.Domain;
using NexLog.Tendering.Domain.Entities;

namespace NexLog.Tendering.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class TenderingSeed
{
    private static readonly System.Text.Json.JsonSerializerOptions Json = new(System.Text.Json.JsonSerializerDefaults.Web);

    /// <summary>Reads an embedded SeedData/*.json file (exported from the Angular mocks).</summary>
    private static List<T> Load<T>(string file)
    {
        var asm = typeof(TenderingSeed).Assembly;
        var name = asm.GetManifestResourceNames().Single(n => n.EndsWith("SeedData." + file));
        using var stream = asm.GetManifestResourceStream(name)!;
        return System.Text.Json.JsonSerializer.Deserialize<List<T>>(stream, Json) ?? [];
    }

    public static async Task SeedAsync(TenderingDbContext db)
    {
        if (!await db.Tenders.AnyAsync())
        {
            db.Tenders.AddRange(new List<Tender>
            {
            new() { Id = "TD-0842", LoadId = "LD-2026-0842", Origin = "Dallas, TX", Destination = "Atlanta, GA", Weight = 38000m, Volume = 2400m, PickupDate = "2026-05-20", Status = "Pending", SelectedCarrier = "Swift Transportation", TenderedAt = "2026-05-18T09:00:00", CascadeCount = 0, CarrierSequence = new() { "Swift Transportation", "Schneider National", "J.B. Hunt" } },
            new() { Id = "TD-0848", LoadId = "LD-2026-0848", Origin = "Laredo, TX", Destination = "Memphis, TN", Weight = 41000m, Volume = 2900m, PickupDate = "2026-05-22", Status = "Rejected", SelectedCarrier = "Schneider National", TenderedAt = "2026-05-18T11:30:00", CascadeCount = 2, CarrierSequence = new() { "Swift Transportation", "Schneider National" } }
            });
        }

        await db.SaveChangesAsync();
    }
}
