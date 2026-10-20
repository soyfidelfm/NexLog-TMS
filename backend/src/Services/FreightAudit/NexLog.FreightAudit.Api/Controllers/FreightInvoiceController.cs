using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.FreightAudit.Application.Dtos;
using NexLog.FreightAudit.Application.Services;

namespace NexLog.FreightAudit.Api.Controllers;

[Route("api/invoices")]
public sealed class FreightInvoiceController(IFreightInvoiceService service) : CrudControllerBase<FreightInvoiceDto>(service)
{
    protected override string GetId(FreightInvoiceDto dto) => dto.Id!;
}
