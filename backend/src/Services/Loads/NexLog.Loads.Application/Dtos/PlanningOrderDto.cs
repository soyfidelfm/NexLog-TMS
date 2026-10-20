using System.ComponentModel.DataAnnotations;
using NexLog.Loads.Domain;

namespace NexLog.Loads.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record PlanningOrderDto(
    string? Id,
    [Required] string Customer,
    string Origin,
    string Destination,
    decimal Weight,
    decimal Volume,
    [AllowedValues("Low", "Medium", "High")] string Priority);
