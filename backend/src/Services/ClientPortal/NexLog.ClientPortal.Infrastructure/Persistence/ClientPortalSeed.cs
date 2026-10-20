using Microsoft.EntityFrameworkCore;
using NexLog.ClientPortal.Domain;
using NexLog.ClientPortal.Domain.Entities;

namespace NexLog.ClientPortal.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class ClientPortalSeed
{
    private static readonly System.Text.Json.JsonSerializerOptions Json = new(System.Text.Json.JsonSerializerDefaults.Web);

    /// <summary>Reads an embedded SeedData/*.json file (exported from the Angular mocks).</summary>
    private static List<T> Load<T>(string file)
    {
        var asm = typeof(ClientPortalSeed).Assembly;
        var name = asm.GetManifestResourceNames().Single(n => n.EndsWith("SeedData." + file));
        using var stream = asm.GetManifestResourceStream(name)!;
        return System.Text.Json.JsonSerializer.Deserialize<List<T>>(stream, Json) ?? [];
    }

    public static async Task SeedAsync(ClientPortalDbContext db)
    {
        if (!await db.PortalShipments.AnyAsync())
            db.PortalShipments.AddRange(Load<PortalShipment>("PortalShipment.json"));

        await db.SaveChangesAsync();
    }
}
