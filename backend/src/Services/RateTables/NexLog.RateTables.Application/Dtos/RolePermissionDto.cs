using System.ComponentModel.DataAnnotations;
using NexLog.RateTables.Domain;

namespace NexLog.RateTables.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record RolePermissionDto(
    string? Id,
    [Required] string Role,
    string Description,
    bool View,
    bool CreateEdit,
    bool Delete,
    bool Approve,
    bool Export,
    bool ManagePermissions);
