using System.ComponentModel.DataAnnotations;
using NexLog.Tracking.Domain;

namespace NexLog.Tracking.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record ShipmentDto(
    string? Id,
    [Required] string OrderNumber,
    string Origin,
    string Destination,
    string Driver,
    string DriverPhone,
    string Vehicle,
    string Eta,
    [AllowedValues("In Transit", "Out for Delivery", "Delayed", "At Pickup")] string Status,
    int Progress,
    string Color,
    string RoutePath,
    MapPoint Position,
    List<ShipmentAlert> Alerts,
    List<ShipmentTimelineItem> Timeline);
