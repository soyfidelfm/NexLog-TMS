using NexLog.BuildingBlocks.Domain;

namespace NexLog.Loads.Domain.Entities;

public class PlanningOrder : Entity
{
    public string Customer { get; set; } = string.Empty;
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public decimal Weight { get; set; }
    public decimal Volume { get; set; }
    public string Priority { get; set; } = string.Empty;
}

/// <summary>Allowed values for PlanningOrder.Priority (same strings as the Angular frontend).</summary>
public static class PlanningOrderPrioritys
{
    public static readonly string[] All = ["Low", "Medium", "High"];
}
