using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.RouteOptimization.Application.Dtos;
using NexLog.RouteOptimization.Application.Services;

namespace NexLog.RouteOptimization.Api.Controllers;

[Route("api/route-runs")]
public sealed class RouteRunController(IRouteRunService service) : CrudControllerBase<RouteSummaryDto>(service)
{
    protected override string GetId(RouteSummaryDto dto) => dto.Id!;
}
