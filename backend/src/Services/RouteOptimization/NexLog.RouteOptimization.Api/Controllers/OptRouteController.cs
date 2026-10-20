using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.RouteOptimization.Application.Dtos;
using NexLog.RouteOptimization.Application.Services;

namespace NexLog.RouteOptimization.Api.Controllers;

[Route("api/routes")]
public sealed class OptRouteController(IOptRouteService service) : CrudControllerBase<OptRouteDto>(service)
{
    protected override string GetId(OptRouteDto dto) => dto.Id!;
}
