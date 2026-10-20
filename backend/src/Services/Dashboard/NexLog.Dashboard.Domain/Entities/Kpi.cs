using NexLog.BuildingBlocks.Domain;

namespace NexLog.Dashboard.Domain.Entities;

public class Kpi : Entity
{
    public string TitleKey { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string ChangeKey { get; set; } = string.Empty;
    public Dictionary<string, string> ChangeParams { get; set; } = new();
    public bool ChangePositive { get; set; }
    public string Icon { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public List<decimal> Sparkline { get; set; } = new();
}
