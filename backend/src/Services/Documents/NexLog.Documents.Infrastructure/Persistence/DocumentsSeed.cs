using Microsoft.EntityFrameworkCore;
using NexLog.Documents.Domain;
using NexLog.Documents.Domain.Entities;

namespace NexLog.Documents.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class DocumentsSeed
{
    private static readonly System.Text.Json.JsonSerializerOptions Json = new(System.Text.Json.JsonSerializerDefaults.Web);

    /// <summary>Reads an embedded SeedData/*.json file (exported from the Angular mocks).</summary>
    private static List<T> Load<T>(string file)
    {
        var asm = typeof(DocumentsSeed).Assembly;
        var name = asm.GetManifestResourceNames().Single(n => n.EndsWith("SeedData." + file));
        using var stream = asm.GetManifestResourceStream(name)!;
        return System.Text.Json.JsonSerializer.Deserialize<List<T>>(stream, Json) ?? [];
    }

    public static async Task SeedAsync(DocumentsDbContext db)
    {
        if (!await db.DocumentItems.AnyAsync())
            db.DocumentItems.AddRange(Load<DocumentItem>("DocumentItem.json"));

        if (!await db.EpodRecords.AnyAsync())
            db.EpodRecords.AddRange(Load<EpodRecord>("EpodRecord.json"));

        await db.SaveChangesAsync();
    }
}
