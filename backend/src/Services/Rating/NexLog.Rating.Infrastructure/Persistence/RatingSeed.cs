using Microsoft.EntityFrameworkCore;
using NexLog.Rating.Domain;
using NexLog.Rating.Domain.Entities;

namespace NexLog.Rating.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class RatingSeed
{
    private static readonly System.Text.Json.JsonSerializerOptions Json = new(System.Text.Json.JsonSerializerDefaults.Web);

    /// <summary>Reads an embedded SeedData/*.json file (exported from the Angular mocks).</summary>
    private static List<T> Load<T>(string file)
    {
        var asm = typeof(RatingSeed).Assembly;
        var name = asm.GetManifestResourceNames().Single(n => n.EndsWith("SeedData." + file));
        using var stream = asm.GetManifestResourceStream(name)!;
        return System.Text.Json.JsonSerializer.Deserialize<List<T>>(stream, Json) ?? [];
    }

    public static async Task SeedAsync(RatingDbContext db)
    {
        if (!await db.CarrierQuotes.AnyAsync())
            db.CarrierQuotes.AddRange(Load<CarrierQuote>("CarrierQuote.json"));

        await db.SaveChangesAsync();
    }
}
