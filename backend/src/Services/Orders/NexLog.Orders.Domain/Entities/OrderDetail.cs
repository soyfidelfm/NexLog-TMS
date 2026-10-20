using NexLog.BuildingBlocks.Domain;

namespace NexLog.Orders.Domain.Entities;

public class OrderDetail : Entity
{
    public string Status { get; set; } = string.Empty;
    public OrderDetailOrigin Origin { get; set; } = new();
    public OrderDetailOrigin Destination { get; set; } = new();
    public decimal WeightLbs { get; set; }
    public decimal WeightKg { get; set; }
    public OrderDimensions Dimensions { get; set; } = new();
    public string ProductType { get; set; } = string.Empty;
    public List<string> SpecialRequirements { get; set; } = new();
    public decimal RouteDistanceMi { get; set; }
    public decimal RouteDistanceKm { get; set; }
    public string TransitTime { get; set; } = string.Empty;
    public string EstimatedArrival { get; set; } = string.Empty;
    public List<OrderTimelineStep> Timeline { get; set; } = new();
    public List<OrderItem> Items { get; set; } = new();
}

/// <summary>Allowed values for OrderDetail.Status (same strings as the Angular frontend).</summary>
public static class OrderDetailStatuss
{
    public static readonly string[] All = ["order-created", "pending-confirmation", "confirmed", "in-transit", "out-for-delivery", "delivered"];
}
