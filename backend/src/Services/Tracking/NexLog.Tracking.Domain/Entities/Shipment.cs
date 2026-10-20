using NexLog.BuildingBlocks.Domain;

namespace NexLog.Tracking.Domain.Entities;

public class Shipment : Entity
{
    public string OrderNumber { get; set; } = string.Empty;
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public string Driver { get; set; } = string.Empty;
    public string DriverPhone { get; set; } = string.Empty;
    public string Vehicle { get; set; } = string.Empty;
    public string Eta { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int Progress { get; set; }
    public string Color { get; set; } = string.Empty;
    public string RoutePath { get; set; } = string.Empty;
    public MapPoint Position { get; set; } = new();
    public List<ShipmentAlert> Alerts { get; set; } = new();
    public List<ShipmentTimelineItem> Timeline { get; set; } = new();
}

/// <summary>Allowed values for Shipment.Status (same strings as the Angular frontend).</summary>
public static class ShipmentStatuss
{
    public static readonly string[] All = ["In Transit", "Out for Delivery", "Delayed", "At Pickup"];
}
