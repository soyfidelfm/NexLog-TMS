using System.ComponentModel.DataAnnotations;
using NexLog.Exceptions.Domain;

namespace NexLog.Exceptions.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record ExceptionItemDto(
    string? Id,
    [Required] string Type,
    string Title,
    string LoadId,
    string? OrderId,
    string Carrier,
    [AllowedValues("Critical", "High", "Medium", "Low")] string Severity,
    [AllowedValues("Open", "In Progress", "Resolved", "Closed")] string Status,
    string OpenedAt,
    string LastUpdate,
    string Location,
    string Description,
    List<TimelineEvent> Timeline,
    List<ActionTaken> Actions,
    List<CommLog> Communications);
