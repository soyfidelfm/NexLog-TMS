using NexLog.BuildingBlocks.Domain;

namespace NexLog.Analytics.Domain.Entities;

public class OnTimeTrend : Entity
{
    public string Period { get; set; } = string.Empty;
    public decimal OnTimePercent { get; set; }
    public int TotalDeliveries { get; set; }
}
