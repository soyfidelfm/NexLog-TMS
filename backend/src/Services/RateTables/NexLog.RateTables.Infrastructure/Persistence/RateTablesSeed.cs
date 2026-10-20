using Microsoft.EntityFrameworkCore;
using NexLog.RateTables.Domain;
using NexLog.RateTables.Domain.Entities;

namespace NexLog.RateTables.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class RateTablesSeed
{
    private static readonly System.Text.Json.JsonSerializerOptions Json = new(System.Text.Json.JsonSerializerDefaults.Web);

    /// <summary>Reads an embedded SeedData/*.json file (exported from the Angular mocks).</summary>
    private static List<T> Load<T>(string file)
    {
        var asm = typeof(RateTablesSeed).Assembly;
        var name = asm.GetManifestResourceNames().Single(n => n.EndsWith("SeedData." + file));
        using var stream = asm.GetManifestResourceStream(name)!;
        return System.Text.Json.JsonSerializer.Deserialize<List<T>>(stream, Json) ?? [];
    }

    public static async Task SeedAsync(RateTablesDbContext db)
    {
        if (!await db.RateTables.AnyAsync())
            db.RateTables.AddRange(Load<RateTable>("RateTable.json"));

        if (!await db.RolePermissions.AnyAsync())
            db.RolePermissions.AddRange(Load<RolePermission>("RolePermission.json"));

        await db.SaveChangesAsync();
    }
}
