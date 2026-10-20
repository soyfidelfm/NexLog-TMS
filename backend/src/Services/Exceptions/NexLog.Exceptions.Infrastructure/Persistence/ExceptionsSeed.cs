using Microsoft.EntityFrameworkCore;
using NexLog.Exceptions.Domain;
using NexLog.Exceptions.Domain.Entities;

namespace NexLog.Exceptions.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class ExceptionsSeed
{
    public static async Task SeedAsync(ExceptionsDbContext db)
    {
        if (!await db.ExceptionCases.AnyAsync())
        {
            db.ExceptionCases.AddRange(new List<ExceptionCase>
            {
            new() { Id = "EXC-2026-0142", Type = "Delay", Title = "Retraso por clima", LoadId = "LD-2026-0845", OrderId = "ORD-2025-00123", Carrier = "Schneider National", Severity = "High", Status = "In Progress", OpenedAt = "2026-05-19T07:30:00", LastUpdate = "2026-05-19T10:05:00", Location = "Detroit, MI", Description = "Tormenta invernal en I-94.", Timeline = new() { new TimelineEvent { Time = "2026-05-19T07:30:00", Title = "Exception opened", Description = "Carrier reported delay", Actor = "System" } }, Actions = new() { new ActionTaken { Id = "A1", Action = "Notified customer", By = "Ops", At = "2026-05-19T08:00:00" } }, Communications = new() { new CommLog { Id = "C1", Channel = "Email", From = "ops@nexlog.example", To = "customer@example.com", Message = "ETA updated", At = "2026-05-19T08:01:00", Direction = "outbound" } } }
            });
        }

        await db.SaveChangesAsync();
    }
}
