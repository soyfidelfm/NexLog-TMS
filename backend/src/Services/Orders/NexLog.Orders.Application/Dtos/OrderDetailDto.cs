using System.ComponentModel.DataAnnotations;
using NexLog.Orders.Domain;

namespace NexLog.Orders.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record OrderDetailDto(
    string? Id,
    [Required] [AllowedValues("order-created", "pending-confirmation", "confirmed", "in-transit", "out-for-delivery", "delivered")] string Status,
    OrderDetailOrigin Origin,
    OrderDetailOrigin Destination,
    decimal WeightLbs,
    decimal WeightKg,
    OrderDimensions Dimensions,
    string ProductType,
    List<string> SpecialRequirements,
    decimal RouteDistanceMi,
    decimal RouteDistanceKm,
    string TransitTime,
    string EstimatedArrival,
    List<OrderTimelineStep> Timeline,
    List<OrderItem> Items);
