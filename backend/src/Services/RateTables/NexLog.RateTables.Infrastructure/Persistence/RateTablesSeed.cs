using Microsoft.EntityFrameworkCore;
using NexLog.RateTables.Domain;
using NexLog.RateTables.Domain.Entities;

namespace NexLog.RateTables.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class RateTablesSeed
{
    public static async Task SeedAsync(RateTablesDbContext db)
    {
        if (!await db.RateTables.AnyAsync())
        {
            db.RateTables.AddRange(new List<RateTable>
            {
            new() { Id = "RT-001", Name = "TX \u2192 GA FTL 2026", Carrier = "Swift Transportation", OriginZone = "TX", DestinationZone = "GA", Mode = "FTL", RateType = "Per Mile", BaseRate = 2.45m, MinCharge = 850m, FuelSurcharge = 18m, EffectiveFrom = "2026-01-01", EffectiveTo = "2026-12-31", Status = "Active" },
            new() { Id = "RT-002", Name = "IL \u2192 MI LTL", Carrier = "Schneider National", OriginZone = "IL", DestinationZone = "MI", Mode = "LTL", RateType = "Per CWT", BaseRate = 32.5m, MinCharge = 180m, FuelSurcharge = 15m, EffectiveFrom = "2026-03-01", EffectiveTo = "2026-08-31", Status = "Draft" },
            new() { Id = "RT-003", Name = "CA \u2192 AZ Reefer 2025", Carrier = "J.B. Hunt", OriginZone = "CA", DestinationZone = "AZ", Mode = "FTL", RateType = "Flat", BaseRate = 1450m, MinCharge = 1450m, FuelSurcharge = 20m, EffectiveFrom = "2025-01-01", EffectiveTo = "2025-12-31", Status = "Expired" }
            });
        }

        if (!await db.RolePermissions.AnyAsync())
        {
            db.RolePermissions.AddRange(new List<RolePermission>
            {
            new() { Id = "admin", Role = "Admin", Description = "Full access", View = true, CreateEdit = true, Delete = true, Approve = true, Export = true, ManagePermissions = true },
            new() { Id = "planner", Role = "Planner", Description = "Plans loads and rates", View = true, CreateEdit = true, Delete = false, Approve = false, Export = true, ManagePermissions = false },
            new() { Id = "viewer", Role = "Viewer", Description = "Read only", View = true, CreateEdit = false, Delete = false, Approve = false, Export = false, ManagePermissions = false }
            });
        }

        await db.SaveChangesAsync();
    }
}
