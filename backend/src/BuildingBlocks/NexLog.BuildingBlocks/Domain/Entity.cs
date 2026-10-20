namespace NexLog.BuildingBlocks.Domain;

/// <summary>Base entity. Ids are strings to match the frontend (e.g. ORD-2025-00125).</summary>
public abstract class Entity
{
    public string Id { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
