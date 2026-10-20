using Microsoft.EntityFrameworkCore;
using NexLog.Carriers.Domain;
using NexLog.Carriers.Domain.Entities;

namespace NexLog.Carriers.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class CarriersSeed
{
    private static readonly System.Text.Json.JsonSerializerOptions Json = new(System.Text.Json.JsonSerializerDefaults.Web);

    /// <summary>Reads an embedded SeedData/*.json file (exported from the Angular mocks).</summary>
    private static List<T> Load<T>(string file)
    {
        var asm = typeof(CarriersSeed).Assembly;
        var name = asm.GetManifestResourceNames().Single(n => n.EndsWith("SeedData." + file));
        using var stream = asm.GetManifestResourceStream(name)!;
        return System.Text.Json.JsonSerializer.Deserialize<List<T>>(stream, Json) ?? [];
    }

    public static async Task SeedAsync(CarriersDbContext db)
    {
        if (!await db.Carriers.AnyAsync())
            db.Carriers.AddRange(Load<Carrier>("Carrier.json"));

        await db.SaveChangesAsync();
    }
}
