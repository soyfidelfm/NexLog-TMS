using Microsoft.EntityFrameworkCore;
using NexLog.FreightAudit.Domain;
using NexLog.FreightAudit.Domain.Entities;

namespace NexLog.FreightAudit.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class FreightAuditSeed
{
    public static async Task SeedAsync(FreightAuditDbContext db)
    {
        if (!await db.FreightInvoices.AnyAsync())
        {
            db.FreightInvoices.AddRange(new List<FreightInvoice>
            {
            new() { Id = "INV-78421", Carrier = "Swift Transportation", LoadId = "LD-2026-0842", InvoiceDate = "2026-05-19", Status = "Pending", Lines = new() { new InvoiceLine { Description = "Linehaul", Expected = 1850, Billed = 1850 }, new InvoiceLine { Description = "Fuel surcharge", Expected = 185, Billed = 210 } } },
            new() { Id = "INV-78435", Carrier = "Schneider National", LoadId = "LD-2026-0845", InvoiceDate = "2026-05-20", Status = "Approved", Lines = new() { new InvoiceLine { Description = "Linehaul", Expected = 1720, Billed = 1720 } } },
            new() { Id = "INV-78448", Carrier = "J.B. Hunt", LoadId = "LD-2026-0848", InvoiceDate = "2026-05-21", Status = "Disputed", Lines = new() { new InvoiceLine { Description = "Linehaul", Expected = 2240, Billed = 2240 }, new InvoiceLine { Description = "Detention", Expected = 0, Billed = 150 } } }
            });
        }

        await db.SaveChangesAsync();
    }
}
