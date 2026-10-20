using Microsoft.EntityFrameworkCore;
using NexLog.Orders.Domain;
using NexLog.Orders.Domain.Entities;

namespace NexLog.Orders.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class OrdersSeed
{
    private static readonly System.Text.Json.JsonSerializerOptions Json = new(System.Text.Json.JsonSerializerDefaults.Web);

    /// <summary>Reads an embedded SeedData/*.json file (exported from the Angular mocks).</summary>
    private static List<T> Load<T>(string file)
    {
        var asm = typeof(OrdersSeed).Assembly;
        var name = asm.GetManifestResourceNames().Single(n => n.EndsWith("SeedData." + file));
        using var stream = asm.GetManifestResourceStream(name)!;
        return System.Text.Json.JsonSerializer.Deserialize<List<T>>(stream, Json) ?? [];
    }

    public static async Task SeedAsync(OrdersDbContext db)
    {
        if (!await db.Orders.AnyAsync())
            db.Orders.AddRange(Load<Order>("Order.json"));

        if (!await db.OrderDetails.AnyAsync())
            db.OrderDetails.AddRange(Load<OrderDetail>("OrderDetail.json"));

        await db.SaveChangesAsync();
    }
}
