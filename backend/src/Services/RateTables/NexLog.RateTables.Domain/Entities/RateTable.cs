using NexLog.BuildingBlocks.Domain;

namespace NexLog.RateTables.Domain.Entities;

public class RateTable : Entity
{
    public string Name { get; set; } = string.Empty;
    public string Carrier { get; set; } = string.Empty;
    public string OriginZone { get; set; } = string.Empty;
    public string DestinationZone { get; set; } = string.Empty;
    public string Mode { get; set; } = string.Empty;
    public string RateType { get; set; } = string.Empty;
    public decimal BaseRate { get; set; }
    public decimal MinCharge { get; set; }
    public decimal FuelSurcharge { get; set; }
    public string EffectiveFrom { get; set; } = string.Empty;
    public string EffectiveTo { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

/// <summary>Allowed values for RateTable.Status (same strings as the Angular frontend).</summary>
public static class RateTableStatuss
{
    public static readonly string[] All = ["Active", "Draft", "Expired"];
}
