using System.ComponentModel.DataAnnotations;
using NexLog.RouteOptimization.Domain;

namespace NexLog.RouteOptimization.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record RouteSummaryDto(
    string? Id,
    RouteMetrics Before,
    RouteMetrics After,
    decimal Co2SavedKg,
    string LastRun);
