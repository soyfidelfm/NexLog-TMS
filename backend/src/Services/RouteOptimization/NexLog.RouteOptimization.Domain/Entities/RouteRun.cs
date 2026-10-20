using NexLog.BuildingBlocks.Domain;

namespace NexLog.RouteOptimization.Domain.Entities;

public class RouteRun : Entity
{
    public RouteMetrics Before { get; set; } = new();
    public RouteMetrics After { get; set; } = new();
    public decimal Co2SavedKg { get; set; }
    public string LastRun { get; set; } = string.Empty;
}
