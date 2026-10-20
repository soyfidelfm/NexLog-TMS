using Microsoft.EntityFrameworkCore;
using NexLog.RouteOptimization.Domain;
using NexLog.RouteOptimization.Domain.Entities;

namespace NexLog.RouteOptimization.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class RouteOptimizationSeed
{
    public static async Task SeedAsync(RouteOptimizationDbContext db)
    {
        if (!await db.OptRoutes.AnyAsync())
        {
            db.OptRoutes.AddRange(new List<OptRoute>
            {
            new() { Id = "R-01", Name = "Ruta Norte", Color = "#3b82f6", Vehicle = "TRK-101", Driver = "Carlos Ruiz", DistanceKm = 142m, DurationMin = 210, Cost = 380m, LoadPct = 86m, Stops = new() { new Stop { Name = "CEDIS", X = 50, Y = 50, Eta = "07:00", Type = "depot" }, new Stop { Name = "Cliente A", X = 30, Y = 20, Eta = "08:10", Type = "delivery" } } },
            new() { Id = "R-02", Name = "Ruta Sur", Color = "#22c55e", Vehicle = "TRK-102", Driver = "Ana L\u00f3pez", DistanceKm = 118m, DurationMin = 185, Cost = 320m, LoadPct = 74m, Stops = new() { new Stop { Name = "CEDIS", X = 50, Y = 50, Eta = "07:00", Type = "depot" }, new Stop { Name = "Proveedor B", X = 60, Y = 80, Eta = "08:30", Type = "pickup" } } }
            });
        }

        if (!await db.RouteRuns.AnyAsync())
        {
            db.RouteRuns.AddRange(new List<RouteRun>
            {
            new() { Id = "RUN-0001", Before = new RouteMetrics { Km = 512, Cost = 1460, Hours = 14.5m, Vehicles = 4 }, After = new RouteMetrics { Km = 398, Cost = 1120, Hours = 11.2m, Vehicles = 3 }, Co2SavedKg = 96m, LastRun = "2026-05-18T06:30:00" }
            });
        }

        await db.SaveChangesAsync();
    }
}
