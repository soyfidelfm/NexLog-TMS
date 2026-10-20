using System.ComponentModel.DataAnnotations;
using NexLog.RouteOptimization.Domain;

namespace NexLog.RouteOptimization.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record OptRouteDto(
    string? Id,
    [Required] string Name,
    string Color,
    string Vehicle,
    string Driver,
    decimal DistanceKm,
    int DurationMin,
    decimal Cost,
    decimal LoadPct,
    List<Stop> Stops);
