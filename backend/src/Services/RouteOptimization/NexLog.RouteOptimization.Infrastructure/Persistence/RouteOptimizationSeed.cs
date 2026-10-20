using Microsoft.EntityFrameworkCore;
using NexLog.RouteOptimization.Domain;
using NexLog.RouteOptimization.Domain.Entities;

namespace NexLog.RouteOptimization.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class RouteOptimizationSeed
{
    private static readonly System.Text.Json.JsonSerializerOptions Json = new(System.Text.Json.JsonSerializerDefaults.Web);

    /// <summary>Reads an embedded SeedData/*.json file (exported from the Angular mocks).</summary>
    private static List<T> Load<T>(string file)
    {
        var asm = typeof(RouteOptimizationSeed).Assembly;
        var name = asm.GetManifestResourceNames().Single(n => n.EndsWith("SeedData." + file));
        using var stream = asm.GetManifestResourceStream(name)!;
        return System.Text.Json.JsonSerializer.Deserialize<List<T>>(stream, Json) ?? [];
    }

    public static async Task SeedAsync(RouteOptimizationDbContext db)
    {
        if (!await db.OptRoutes.AnyAsync())
            db.OptRoutes.AddRange(Load<OptRoute>("OptRoute.json"));

        if (!await db.RouteRuns.AnyAsync())
            db.RouteRuns.AddRange(Load<RouteRun>("RouteRun.json"));

        await db.SaveChangesAsync();
    }
}
