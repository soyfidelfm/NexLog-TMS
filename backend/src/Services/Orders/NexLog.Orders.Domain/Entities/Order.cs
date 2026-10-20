using NexLog.BuildingBlocks.Domain;

namespace NexLog.Orders.Domain.Entities;

public class Order : Entity
{
    public OrderOriginDest Origin { get; set; } = new();
    public OrderOriginDest Destination { get; set; } = new();
    public decimal Weight { get; set; }
    public decimal Volume { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Carrier { get; set; } = string.Empty;
    public string Eta { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
}

/// <summary>Allowed values for Order.Status (same strings as the Angular frontend).</summary>
public static class OrderStatuss
{
    public static readonly string[] All = ["Delivered", "In Transit", "Picked Up", "Booked", "Delayed"];
}

/// <summary>Allowed values for Order.Priority (same strings as the Angular frontend).</summary>
public static class OrderPrioritys
{
    public static readonly string[] All = ["Low", "Medium", "High"];
}
