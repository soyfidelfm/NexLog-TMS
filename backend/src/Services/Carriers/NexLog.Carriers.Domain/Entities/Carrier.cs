using NexLog.BuildingBlocks.Domain;

namespace NexLog.Carriers.Domain.Entities;

public class Carrier : Entity
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal OnTimePercent { get; set; }
    public decimal ClaimsRate { get; set; }
    public decimal Rating { get; set; }
    public int TotalLoads { get; set; }
    public string McNumber { get; set; } = string.Empty;
    public string DotNumber { get; set; } = string.Empty;
    public string Contact { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public List<string> Equipment { get; set; } = new();
    public string Notes { get; set; } = string.Empty;
}

/// <summary>Allowed values for Carrier.Status (same strings as the Angular frontend).</summary>
public static class CarrierStatuss
{
    public static readonly string[] All = ["Active", "Inactive", "Pending"];
}
