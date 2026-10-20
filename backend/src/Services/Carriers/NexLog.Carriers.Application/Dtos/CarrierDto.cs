using System.ComponentModel.DataAnnotations;
using NexLog.Carriers.Domain;

namespace NexLog.Carriers.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record CarrierDto(
    string? Id,
    [Required] string Name,
    string Code,
    [AllowedValues("Active", "Inactive", "Pending")] string Status,
    decimal OnTimePercent,
    decimal ClaimsRate,
    decimal Rating,
    int TotalLoads,
    string McNumber,
    string DotNumber,
    string Contact,
    string Phone,
    string Email,
    string City,
    string State,
    List<string> Equipment,
    string Notes);
