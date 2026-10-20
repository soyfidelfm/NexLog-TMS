using System.ComponentModel.DataAnnotations;
using NexLog.Rating.Domain;

namespace NexLog.Rating.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record CarrierQuoteDto(
    string? Id,
    [Required] string Carrier,
    string? Logo,
    decimal Price,
    string Currency,
    int TransitDays,
    string ServiceType,
    decimal OnTimePercent,
    decimal Rating,
    decimal FuelSurcharge,
    decimal Total,
    string? Notes);
