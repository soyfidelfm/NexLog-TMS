using NexLog.BuildingBlocks.Domain;

namespace NexLog.Analytics.Domain.Entities;

public class LaneCost : Entity
{
    public string Lane { get; set; } = string.Empty;
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public decimal AvgCost { get; set; }
    public decimal TotalCost { get; set; }
    public int Volume { get; set; }
    public string Mode { get; set; } = string.Empty;
}
