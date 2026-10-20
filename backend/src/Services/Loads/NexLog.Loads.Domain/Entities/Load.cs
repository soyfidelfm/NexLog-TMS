using NexLog.BuildingBlocks.Domain;

namespace NexLog.Loads.Domain.Entities;

public class Load : Entity
{
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public decimal Weight { get; set; }
    public decimal Volume { get; set; }
    public string PickupDate { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? SelectedCarrier { get; set; }
    public string? TenderedAt { get; set; }
    public int CascadeCount { get; set; }
}

/// <summary>Allowed values for Load.Status (same strings as the Angular frontend).</summary>
public static class LoadStatuss
{
    public static readonly string[] All = ["Pending", "Accepted", "Rejected"];
}
