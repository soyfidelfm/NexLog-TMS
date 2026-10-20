using Microsoft.EntityFrameworkCore;
using NexLog.FreightAudit.Domain;
using NexLog.FreightAudit.Domain.Entities;

namespace NexLog.FreightAudit.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class FreightAuditSeed
{
    private static readonly System.Text.Json.JsonSerializerOptions Json = new(System.Text.Json.JsonSerializerDefaults.Web);

    /// <summary>Reads an embedded SeedData/*.json file (exported from the Angular mocks).</summary>
    private static List<T> Load<T>(string file)
    {
        var asm = typeof(FreightAuditSeed).Assembly;
        var name = asm.GetManifestResourceNames().Single(n => n.EndsWith("SeedData." + file));
        using var stream = asm.GetManifestResourceStream(name)!;
        return System.Text.Json.JsonSerializer.Deserialize<List<T>>(stream, Json) ?? [];
    }

    public static async Task SeedAsync(FreightAuditDbContext db)
    {
        if (!await db.FreightInvoices.AnyAsync())
            db.FreightInvoices.AddRange(Load<FreightInvoice>("FreightInvoice.json"));

        await db.SaveChangesAsync();
    }
}
