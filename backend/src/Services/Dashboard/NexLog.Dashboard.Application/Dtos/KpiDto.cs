using System.ComponentModel.DataAnnotations;
using NexLog.Dashboard.Domain;

namespace NexLog.Dashboard.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record KpiDto(
    string? Id,
    [Required] string TitleKey,
    string Value,
    string ChangeKey,
    Dictionary<string, string> ChangeParams,
    bool ChangePositive,
    string Icon,
    string Color,
    List<decimal> Sparkline);
