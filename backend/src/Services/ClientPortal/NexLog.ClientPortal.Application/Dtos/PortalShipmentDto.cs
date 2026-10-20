using System.ComponentModel.DataAnnotations;
using NexLog.ClientPortal.Domain;

namespace NexLog.ClientPortal.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record PortalShipmentDto(
    string? Id,
    [Required] string TrackingNumber,
    string Origin,
    string Destination,
    [AllowedValues("Pending", "Picked Up", "In Transit", "Out for Delivery", "Delivered")] string Status,
    int Progress,
    string Eta,
    List<PortalDocument> Documents);
