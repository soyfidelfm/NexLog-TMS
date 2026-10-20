using Microsoft.EntityFrameworkCore;
using NexLog.Carriers.Domain;
using NexLog.Carriers.Domain.Entities;

namespace NexLog.Carriers.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class CarriersSeed
{
    public static async Task SeedAsync(CarriersDbContext db)
    {
        if (!await db.Carriers.AnyAsync())
        {
            db.Carriers.AddRange(new List<Carrier>
            {
            new() { Id = "CR-001", Name = "Swift Transportation", Code = "SWFT", Status = "Active", OnTimePercent = 96.2m, ClaimsRate = 0.4m, Rating = 4.7m, TotalLoads = 1248, McNumber = "MC-123456", DotNumber = "DOT-789012", Contact = "John Miller", Phone = "+1 602 555 0101", Email = "dispatch@swift.example", City = "Phoenix", State = "AZ", Equipment = new() { "Dry Van", "Reefer" }, Notes = "" },
            new() { Id = "CR-002", Name = "Schneider National", Code = "SNDR", Status = "Active", OnTimePercent = 94.8m, ClaimsRate = 0.6m, Rating = 4.5m, TotalLoads = 982, McNumber = "MC-234567", DotNumber = "DOT-890123", Contact = "Sarah Lee", Phone = "+1 920 555 0102", Email = "ops@schneider.example", City = "Green Bay", State = "WI", Equipment = new() { "Dry Van", "Flatbed" }, Notes = "" },
            new() { Id = "CR-003", Name = "J.B. Hunt", Code = "JBHT", Status = "Pending", OnTimePercent = 92.1m, ClaimsRate = 0.9m, Rating = 4.2m, TotalLoads = 640, McNumber = "MC-345678", DotNumber = "DOT-901234", Contact = "Mike Brown", Phone = "+1 479 555 0103", Email = "loads@jbhunt.example", City = "Lowell", State = "AR", Equipment = new() { "Intermodal" }, Notes = "Onboarding" }
            });
        }

        await db.SaveChangesAsync();
    }
}
