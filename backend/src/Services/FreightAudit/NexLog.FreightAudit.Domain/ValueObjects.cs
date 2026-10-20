namespace NexLog.FreightAudit.Domain;

public class InvoiceLine
{
    public string Description { get; set; } = string.Empty;
    public decimal Expected { get; set; }
    public decimal Billed { get; set; }
}
