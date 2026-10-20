using Microsoft.EntityFrameworkCore;
using NexLog.Dashboard.Domain;
using NexLog.Dashboard.Domain.Entities;

namespace NexLog.Dashboard.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class DashboardSeed
{
    private static readonly System.Text.Json.JsonSerializerOptions Json = new(System.Text.Json.JsonSerializerDefaults.Web);

    /// <summary>Reads an embedded SeedData/*.json file (exported from the Angular mocks).</summary>
    private static List<T> Load<T>(string file)
    {
        var asm = typeof(DashboardSeed).Assembly;
        var name = asm.GetManifestResourceNames().Single(n => n.EndsWith("SeedData." + file));
        using var stream = asm.GetManifestResourceStream(name)!;
        return System.Text.Json.JsonSerializer.Deserialize<List<T>>(stream, Json) ?? [];
    }

    public static async Task SeedAsync(DashboardDbContext db)
    {
        if (!await db.Kpis.AnyAsync())
            db.Kpis.AddRange(Load<Kpi>("Kpi.json"));

        if (!await db.DashboardAlerts.AnyAsync())
            db.DashboardAlerts.AddRange(Load<DashboardAlert>("DashboardAlert.json"));

        await db.SaveChangesAsync();
    }
}
