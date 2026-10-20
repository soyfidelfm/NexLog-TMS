using NexLog.BuildingBlocks.Domain;

namespace NexLog.Rating.Domain.Entities;

public class CarrierQuote : Entity
{
    public string Carrier { get; set; } = string.Empty;
    public string? Logo { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; } = string.Empty;
    public int TransitDays { get; set; }
    public string ServiceType { get; set; } = string.Empty;
    public decimal OnTimePercent { get; set; }
    public decimal Rating { get; set; }
    public decimal FuelSurcharge { get; set; }
    public decimal Total { get; set; }
    public string? Notes { get; set; }
}
