using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.Loads.Application.Dtos;
using NexLog.Loads.Application.Services;

namespace NexLog.Loads.Api.Controllers;

[Route("api/planning-orders")]
public sealed class PlanningOrderController(IPlanningOrderService service) : CrudControllerBase<PlanningOrderDto>(service)
{
    protected override string GetId(PlanningOrderDto dto) => dto.Id!;
}
