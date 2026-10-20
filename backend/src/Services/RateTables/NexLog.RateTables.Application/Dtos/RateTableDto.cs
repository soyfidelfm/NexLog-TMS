using System.ComponentModel.DataAnnotations;
using NexLog.RateTables.Domain;

namespace NexLog.RateTables.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record RateTableDto(
    string? Id,
    [Required] string Name,
    string Carrier,
    string OriginZone,
    string DestinationZone,
    string Mode,
    string RateType,
    decimal BaseRate,
    decimal MinCharge,
    decimal FuelSurcharge,
    string EffectiveFrom,
    string EffectiveTo,
    [AllowedValues("Active", "Draft", "Expired")] string Status);
