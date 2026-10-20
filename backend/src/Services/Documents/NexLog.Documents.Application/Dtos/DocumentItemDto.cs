using System.ComponentModel.DataAnnotations;
using NexLog.Documents.Domain;

namespace NexLog.Documents.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record DocumentItemDto(
    string? Id,
    [Required] [AllowedValues("BOL", "POD", "Invoice", "Other")] string Type,
    string Name,
    [AllowedValues("Uploaded", "Pending", "Signed", "Approved")] string Status,
    string UploadedAt,
    string Size,
    string Icon,
    string? LoadId,
    string? OrderId);
