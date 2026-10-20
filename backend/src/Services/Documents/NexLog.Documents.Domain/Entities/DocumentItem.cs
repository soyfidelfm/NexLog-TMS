using NexLog.BuildingBlocks.Domain;

namespace NexLog.Documents.Domain.Entities;

public class DocumentItem : Entity
{
    public string Type { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string UploadedAt { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string? LoadId { get; set; }
    public string? OrderId { get; set; }
}

/// <summary>Allowed values for DocumentItem.Type (same strings as the Angular frontend).</summary>
public static class DocumentItemTypes
{
    public static readonly string[] All = ["BOL", "POD", "Invoice", "Other"];
}

/// <summary>Allowed values for DocumentItem.Status (same strings as the Angular frontend).</summary>
public static class DocumentItemStatuss
{
    public static readonly string[] All = ["Uploaded", "Pending", "Signed", "Approved"];
}
