using Microsoft.EntityFrameworkCore;
using NexLog.ClientPortal.Domain;
using NexLog.ClientPortal.Domain.Entities;

namespace NexLog.ClientPortal.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class ClientPortalSeed
{
    public static async Task SeedAsync(ClientPortalDbContext db)
    {
        if (!await db.PortalShipments.AnyAsync())
        {
            db.PortalShipments.AddRange(new List<PortalShipment>
            {
            new() { Id = "SHP-10482", TrackingNumber = "NXL-10482-MX", Origin = "Guadalajara, JAL", Destination = "Phoenix, AZ", Status = "In Transit", Progress = 55, Eta = "2026-05-21", Documents = new() { new PortalDocument { Name = "BOL-10482.pdf", Type = "BOL" } } },
            new() { Id = "SHP-10491", TrackingNumber = "NXL-10491-US", Origin = "Houston, TX", Destination = "Denver, CO", Status = "Delivered", Progress = 100, Eta = "2026-05-17", Documents = new() { new PortalDocument { Name = "POD-10491.pdf", Type = "POD" } } }
            });
        }

        await db.SaveChangesAsync();
    }
}
