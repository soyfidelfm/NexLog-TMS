using Microsoft.EntityFrameworkCore;
using NexLog.Dashboard.Domain;
using NexLog.Dashboard.Domain.Entities;

namespace NexLog.Dashboard.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Angular mock services (src/app/core/services).</summary>
public static class DashboardSeed
{
    public static async Task SeedAsync(DashboardDbContext db)
    {
        if (!await db.Kpis.AnyAsync())
        {
            db.Kpis.AddRange(new List<Kpi>
            {
            new() { Id = "KPI-1", TitleKey = "kpiShipments", Value = "1,284", ChangeKey = "dashboard.changeVsDate", ChangeParams = new() { ["pct"] = "12" }, ChangePositive = true, Icon = "local_shipping", Color = "blue", Sparkline = new() { 12, 18, 15, 22, 28, 26, 31 } },
            new() { Id = "KPI-2", TitleKey = "kpiOnTime", Value = "95.4%", ChangeKey = "dashboard.changeVsDate", ChangeParams = new() { ["pct"] = "2.1" }, ChangePositive = true, Icon = "schedule", Color = "green", Sparkline = new() { 90, 92, 91, 93, 94, 95, 95 } },
            new() { Id = "KPI-3", TitleKey = "kpiCost", Value = "$1.74M", ChangeKey = "dashboard.changeVsDate", ChangeParams = new() { ["pct"] = "3.4" }, ChangePositive = false, Icon = "payments", Color = "amber", Sparkline = new() }
            });
        }

        if (!await db.DashboardAlerts.AnyAsync())
        {
            db.DashboardAlerts.AddRange(new List<DashboardAlert>
            {
            new() { Id = "1", Type = "delay", TitleKey = "alertDelay", DescKey = "alertDelayDesc", TimeKey = "time.minAgo", N = 15, Icon = "schedule", Color = "amber" },
            new() { Id = "2", Type = "exception", TitleKey = "alertException", DescKey = "alertExceptionDesc", TimeKey = "time.hourAgo", N = 1, Icon = "error", Color = "red" },
            new() { Id = "3", Type = "weather", TitleKey = "alertWeather", DescKey = "alertWeatherDesc", TimeKey = "time.hoursAgo", N = 3, Icon = "thunderstorm", Color = "blue" }
            });
        }

        await db.SaveChangesAsync();
    }
}
