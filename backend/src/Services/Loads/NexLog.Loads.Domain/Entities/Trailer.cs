using NexLog.BuildingBlocks.Domain;

namespace NexLog.Loads.Domain.Entities;

public class Trailer : Entity
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal MaxWeight { get; set; }
    public decimal MaxVolume { get; set; }
    public List<PlanningOrderRef> Assigned { get; set; } = new();
}
