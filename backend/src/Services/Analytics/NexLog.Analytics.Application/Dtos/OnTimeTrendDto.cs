using System.ComponentModel.DataAnnotations;
using NexLog.Analytics.Domain;

namespace NexLog.Analytics.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record OnTimeTrendDto(
    string? Id,
    [Required] string Period,
    decimal OnTimePercent,
    int TotalDeliveries);
