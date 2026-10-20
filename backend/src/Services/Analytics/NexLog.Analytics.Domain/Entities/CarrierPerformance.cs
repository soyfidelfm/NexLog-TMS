using NexLog.BuildingBlocks.Domain;

namespace NexLog.Analytics.Domain.Entities;

public class CarrierPerformance : Entity
{
    public string Carrier { get; set; } = string.Empty;
    public decimal OnTimePercent { get; set; }
    public decimal AvgCost { get; set; }
    public int TotalVolume { get; set; }
    public int Claims { get; set; }
    public decimal Score { get; set; }
}
