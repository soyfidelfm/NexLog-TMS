using NexLog.BuildingBlocks.Domain;

namespace NexLog.ClientPortal.Domain.Entities;

public class PortalShipment : Entity
{
    public string TrackingNumber { get; set; } = string.Empty;
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int Progress { get; set; }
    public string Eta { get; set; } = string.Empty;
    public List<PortalDocument> Documents { get; set; } = new();
}

/// <summary>Allowed values for PortalShipment.Status (same strings as the Angular frontend).</summary>
public static class PortalShipmentStatuss
{
    public static readonly string[] All = ["Pending", "Picked Up", "In Transit", "Out for Delivery", "Delivered"];
}
