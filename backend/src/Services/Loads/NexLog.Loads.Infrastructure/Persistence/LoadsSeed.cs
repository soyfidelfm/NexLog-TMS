using Microsoft.EntityFrameworkCore;
using NexLog.Loads.Domain;
using NexLog.Loads.Domain.Entities;

namespace NexLog.Loads.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class LoadsSeed
{
    private static readonly System.Text.Json.JsonSerializerOptions Json = new(System.Text.Json.JsonSerializerDefaults.Web);

    /// <summary>Reads an embedded SeedData/*.json file (exported from the Angular mocks).</summary>
    private static List<T> Load<T>(string file)
    {
        var asm = typeof(LoadsSeed).Assembly;
        var name = asm.GetManifestResourceNames().Single(n => n.EndsWith("SeedData." + file));
        using var stream = asm.GetManifestResourceStream(name)!;
        return System.Text.Json.JsonSerializer.Deserialize<List<T>>(stream, Json) ?? [];
    }

    public static async Task SeedAsync(LoadsDbContext db)
    {
        if (!await db.Loads.AnyAsync())
            db.Loads.AddRange(Load<Load>("Load.json"));

        if (!await db.Trailers.AnyAsync())
            db.Trailers.AddRange(Load<Trailer>("Trailer.json"));

        if (!await db.PlanningOrders.AnyAsync())
            db.PlanningOrders.AddRange(Load<PlanningOrder>("PlanningOrder.json"));

        await db.SaveChangesAsync();
    }
}
