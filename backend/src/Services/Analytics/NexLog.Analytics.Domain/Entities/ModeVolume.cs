using NexLog.BuildingBlocks.Domain;

namespace NexLog.Analytics.Domain.Entities;

public class ModeVolume : Entity
{
    public string Mode { get; set; } = string.Empty;
    public int Volume { get; set; }
    public decimal Percentage { get; set; }
    public decimal Cost { get; set; }
}
