using NexLog.BuildingBlocks.Domain;

namespace NexLog.Exceptions.Domain.Entities;

public class ExceptionCase : Entity
{
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string LoadId { get; set; } = string.Empty;
    public string? OrderId { get; set; }
    public string Carrier { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string OpenedAt { get; set; } = string.Empty;
    public string LastUpdate { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<TimelineEvent> Timeline { get; set; } = new();
    public List<ActionTaken> Actions { get; set; } = new();
    public List<CommLog> Communications { get; set; } = new();
}

/// <summary>Allowed values for ExceptionCase.Severity (same strings as the Angular frontend).</summary>
public static class ExceptionCaseSeveritys
{
    public static readonly string[] All = ["Critical", "High", "Medium", "Low"];
}

/// <summary>Allowed values for ExceptionCase.Status (same strings as the Angular frontend).</summary>
public static class ExceptionCaseStatuss
{
    public static readonly string[] All = ["Open", "In Progress", "Resolved", "Closed"];
}
