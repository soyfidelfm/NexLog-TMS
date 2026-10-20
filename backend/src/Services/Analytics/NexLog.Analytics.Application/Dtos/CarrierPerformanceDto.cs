using System.ComponentModel.DataAnnotations;
using NexLog.Analytics.Domain;

namespace NexLog.Analytics.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record CarrierPerformanceDto(
    string? Id,
    [Required] string Carrier,
    decimal OnTimePercent,
    decimal AvgCost,
    int TotalVolume,
    int Claims,
    decimal Score);
