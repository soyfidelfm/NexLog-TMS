using System.ComponentModel.DataAnnotations;
using NexLog.Loads.Domain;

namespace NexLog.Loads.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record LoadDto(
    string? Id,
    [Required] string Origin,
    string Destination,
    decimal Weight,
    decimal Volume,
    string PickupDate,
    [AllowedValues("Pending", "Accepted", "Rejected")] string Status,
    string? SelectedCarrier,
    string? TenderedAt,
    int CascadeCount);
