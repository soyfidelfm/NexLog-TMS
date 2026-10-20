using Microsoft.EntityFrameworkCore;
using NexLog.Rating.Domain;
using NexLog.Rating.Domain.Entities;

namespace NexLog.Rating.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class RatingSeed
{
    public static async Task SeedAsync(RatingDbContext db)
    {
        if (!await db.CarrierQuotes.AnyAsync())
        {
            db.CarrierQuotes.AddRange(new List<CarrierQuote>
            {
            new() { Id = "1", Carrier = "Swift Transportation", Price = 1850m, Currency = "USD", TransitDays = 3, ServiceType = "Standard", OnTimePercent = 96m, Rating = 4.7m, FuelSurcharge = 185m, Total = 2035m },
            new() { Id = "2", Carrier = "Schneider National", Price = 1720m, Currency = "USD", TransitDays = 4, ServiceType = "Economy", OnTimePercent = 94m, Rating = 4.5m, FuelSurcharge = 172m, Total = 1892m },
            new() { Id = "3", Carrier = "J.B. Hunt", Price = 2240m, Currency = "USD", TransitDays = 2, ServiceType = "Expedited", OnTimePercent = 97m, Rating = 4.6m, FuelSurcharge = 224m, Total = 2464m }
            });
        }

        await db.SaveChangesAsync();
    }
}
