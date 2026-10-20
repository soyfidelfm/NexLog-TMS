using System.ComponentModel.DataAnnotations;
using NexLog.Orders.Domain;

namespace NexLog.Orders.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record OrderDto(
    string? Id,
    OrderOriginDest Origin,
    OrderOriginDest Destination,
    decimal Weight,
    decimal Volume,
    [AllowedValues("Delivered", "In Transit", "Picked Up", "Booked", "Delayed")] string Status,
    string Carrier,
    string Eta,
    [AllowedValues("Low", "Medium", "High")] string Priority);
