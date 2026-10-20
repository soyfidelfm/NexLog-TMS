using NexLog.BuildingBlocks.Domain;

namespace NexLog.Documents.Domain.Entities;

public class EpodRecord : Entity
{
    public string? LoadId { get; set; }
    public string Signature { get; set; } = string.Empty;
    public string PhotoUrl { get; set; } = string.Empty;
    public double GpsLat { get; set; }
    public double GpsLng { get; set; }
    public string Address { get; set; } = string.Empty;
    public string DeliveredAt { get; set; } = string.Empty;
    public string SignedBy { get; set; } = string.Empty;
    public string? Notes { get; set; }
}
