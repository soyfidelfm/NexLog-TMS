using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.Tracking.Application.Dtos;
using NexLog.Tracking.Application.Services;

namespace NexLog.Tracking.Api.Controllers;

[Route("api/shipments")]
public sealed class ShipmentController(IShipmentService service) : CrudControllerBase<ShipmentDto>(service)
{
    protected override string GetId(ShipmentDto dto) => dto.Id!;
}
