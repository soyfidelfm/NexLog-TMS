using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.ClientPortal.Application.Dtos;
using NexLog.ClientPortal.Application.Services;

namespace NexLog.ClientPortal.Api.Controllers;

[Route("api/portal/shipments")]
public sealed class PortalShipmentController(IPortalShipmentService service) : CrudControllerBase<PortalShipmentDto>(service)
{
    protected override string GetId(PortalShipmentDto dto) => dto.Id!;
}
