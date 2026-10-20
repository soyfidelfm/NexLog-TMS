using Microsoft.EntityFrameworkCore;
using NexLog.Documents.Domain;
using NexLog.Documents.Domain.Entities;

namespace NexLog.Documents.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class DocumentsSeed
{
    public static async Task SeedAsync(DocumentsDbContext db)
    {
        if (!await db.DocumentItems.AnyAsync())
        {
            db.DocumentItems.AddRange(new List<DocumentItem>
            {
            new() { Id = "DOC-001", Type = "BOL", Name = "BOL_LD-2026-0842.pdf", Status = "Signed", UploadedAt = "2026-05-18T08:00:00", Size = "245 KB", Icon = "description", LoadId = "LD-2026-0842" },
            new() { Id = "DOC-002", Type = "POD", Name = "POD_LD-2026-0845.pdf", Status = "Approved", UploadedAt = "2026-05-19T16:20:00", Size = "1.2 MB", Icon = "task", LoadId = "LD-2026-0845" },
            new() { Id = "DOC-003", Type = "Invoice", Name = "INV-78421.pdf", Status = "Pending", UploadedAt = "2026-05-19T18:00:00", Size = "180 KB", Icon = "receipt" }
            });
        }

        if (!await db.EpodRecords.AnyAsync())
        {
            db.EpodRecords.AddRange(new List<EpodRecord>
            {
            new() { Id = "POD-0845", LoadId = "LD-2026-0845", Signature = "data:image/png;base64,", PhotoUrl = "/assets/pod-0845.jpg", GpsLat = 42.3314d, GpsLng = -83.0458d, Address = "1500 Woodward Ave, Detroit, MI", DeliveredAt = "2026-05-19T15:42:00", SignedBy = "M. Johnson", Notes = "Sin da\u00f1os" }
            });
        }

        await db.SaveChangesAsync();
    }
}
