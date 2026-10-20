using System.ComponentModel.DataAnnotations;
using NexLog.Dashboard.Domain;

namespace NexLog.Dashboard.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record AlertDto(
    string? Id,
    [Required] [AllowedValues("delay", "exception", "cost", "weather")] string Type,
    string TitleKey,
    string DescKey,
    string TimeKey,
    int N,
    string Icon,
    string Color);
