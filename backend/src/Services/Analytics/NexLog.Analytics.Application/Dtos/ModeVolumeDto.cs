using System.ComponentModel.DataAnnotations;
using NexLog.Analytics.Domain;

namespace NexLog.Analytics.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record ModeVolumeDto(
    string? Id,
    [Required] string Mode,
    int Volume,
    decimal Percentage,
    decimal Cost);
