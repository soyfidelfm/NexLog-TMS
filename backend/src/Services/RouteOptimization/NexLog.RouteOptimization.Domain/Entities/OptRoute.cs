using NexLog.BuildingBlocks.Domain;

namespace NexLog.RouteOptimization.Domain.Entities;

public class OptRoute : Entity
{
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string Vehicle { get; set; } = string.Empty;
    public string Driver { get; set; } = string.Empty;
    public decimal DistanceKm { get; set; }
    public int DurationMin { get; set; }
    public decimal Cost { get; set; }
    public decimal LoadPct { get; set; }
    public List<Stop> Stops { get; set; } = new();
}
