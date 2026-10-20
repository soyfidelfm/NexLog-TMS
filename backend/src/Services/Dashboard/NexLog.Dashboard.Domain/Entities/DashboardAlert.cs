using NexLog.BuildingBlocks.Domain;

namespace NexLog.Dashboard.Domain.Entities;

public class DashboardAlert : Entity
{
    public string Type { get; set; } = string.Empty;
    public string TitleKey { get; set; } = string.Empty;
    public string DescKey { get; set; } = string.Empty;
    public string TimeKey { get; set; } = string.Empty;
    public int N { get; set; }
    public string Icon { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
}

/// <summary>Allowed values for DashboardAlert.Type (same strings as the Angular frontend).</summary>
public static class DashboardAlertTypes
{
    public static readonly string[] All = ["delay", "exception", "cost", "weather"];
}
