using System.ComponentModel.DataAnnotations;
using NexLog.Loads.Domain;

namespace NexLog.Loads.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record TrailerDto(
    string? Id,
    [Required] string Name,
    string Type,
    decimal MaxWeight,
    decimal MaxVolume,
    List<PlanningOrderRef> Assigned);
