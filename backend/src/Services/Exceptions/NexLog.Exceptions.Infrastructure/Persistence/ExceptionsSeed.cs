using Microsoft.EntityFrameworkCore;
using NexLog.Exceptions.Domain;
using NexLog.Exceptions.Domain.Entities;

namespace NexLog.Exceptions.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class ExceptionsSeed
{
    private static readonly System.Text.Json.JsonSerializerOptions Json = new(System.Text.Json.JsonSerializerDefaults.Web);

    /// <summary>Reads an embedded SeedData/*.json file (exported from the Angular mocks).</summary>
    private static List<T> Load<T>(string file)
    {
        var asm = typeof(ExceptionsSeed).Assembly;
        var name = asm.GetManifestResourceNames().Single(n => n.EndsWith("SeedData." + file));
        using var stream = asm.GetManifestResourceStream(name)!;
        return System.Text.Json.JsonSerializer.Deserialize<List<T>>(stream, Json) ?? [];
    }

    public static async Task SeedAsync(ExceptionsDbContext db)
    {
        if (!await db.ExceptionCases.AnyAsync())
            db.ExceptionCases.AddRange(Load<ExceptionCase>("ExceptionCase.json"));

        await db.SaveChangesAsync();
    }
}
