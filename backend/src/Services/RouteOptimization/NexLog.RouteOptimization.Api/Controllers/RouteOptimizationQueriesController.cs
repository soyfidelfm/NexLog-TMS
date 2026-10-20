using Microsoft.AspNetCore.Mvc;
using NexLog.RouteOptimization.Application.Dtos;
using NexLog.RouteOptimization.Application.Services;

namespace NexLog.RouteOptimization.Api.Controllers;

[ApiController]
[Route("api/routes/summary")]
public sealed class RouteSummaryController(IRouteRunService runs) : ControllerBase
{
    /// <summary>Latest optimization run (frontend RouteSummary).</summary>
    [HttpGet]
    public async Task<ActionResult<RouteSummaryDto>> Latest(CancellationToken ct)
    {
        var all = await runs.GetAllAsync(ct);
        var last = all.OrderByDescending(r => r.LastRun).FirstOrDefault();
        return last is null ? NotFound() : Ok(last);
    }
}
