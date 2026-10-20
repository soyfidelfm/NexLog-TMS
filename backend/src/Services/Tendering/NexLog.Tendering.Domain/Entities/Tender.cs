using NexLog.BuildingBlocks.Domain;

namespace NexLog.Tendering.Domain.Entities;

public class Tender : Entity
{
    public string LoadId { get; set; } = string.Empty;
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public decimal Weight { get; set; }
    public decimal Volume { get; set; }
    public string PickupDate { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? SelectedCarrier { get; set; }
    public string? TenderedAt { get; set; }
    public int CascadeCount { get; set; }
    public List<string> CarrierSequence { get; set; } = new();
}

/// <summary>Allowed values for Tender.Status (same strings as the Angular frontend).</summary>
public static class TenderStatuss
{
    public static readonly string[] All = ["Pending", "Accepted", "Rejected"];
}
