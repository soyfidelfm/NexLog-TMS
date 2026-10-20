using System.ComponentModel.DataAnnotations;
using NexLog.FreightAudit.Domain;

namespace NexLog.FreightAudit.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record FreightInvoiceDto(
    string? Id,
    [Required] string Carrier,
    string LoadId,
    string InvoiceDate,
    [AllowedValues("Pending", "Approved", "Disputed", "Adjusted")] string Status,
    List<InvoiceLine> Lines)
{
    public decimal ExpectedTotal => Lines.Sum(l => l.Expected);
    public decimal BilledTotal => Lines.Sum(l => l.Billed);
    public decimal Variance => BilledTotal - ExpectedTotal;
}
