using NexLog.BuildingBlocks.Domain;

namespace NexLog.FreightAudit.Domain.Entities;

public class FreightInvoice : Entity
{
    public string Carrier { get; set; } = string.Empty;
    public string LoadId { get; set; } = string.Empty;
    public string InvoiceDate { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public List<InvoiceLine> Lines { get; set; } = new();
}

/// <summary>Allowed values for FreightInvoice.Status (same strings as the Angular frontend).</summary>
public static class FreightInvoiceStatuss
{
    public static readonly string[] All = ["Pending", "Approved", "Disputed", "Adjusted"];
}
