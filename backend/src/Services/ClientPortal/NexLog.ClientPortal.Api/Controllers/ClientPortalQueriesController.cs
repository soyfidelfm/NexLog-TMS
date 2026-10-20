using Microsoft.AspNetCore.Mvc;
using NexLog.ClientPortal.Application.Dtos;
using NexLog.ClientPortal.Application.Services;

namespace NexLog.ClientPortal.Api.Controllers;

[ApiController]
[Route("api/portal/track")]
public sealed class PortalTrackingController(IPortalShipmentService shipments) : ControllerBase
{
    [HttpGet("{trackingNumber}")]
    public async Task<ActionResult<PortalShipmentDto>> Track(string trackingNumber, CancellationToken ct)
    {
        var page = await shipments.GetPagedAsync(new NexLog.BuildingBlocks.Common.PageQuery { Search = trackingNumber, PageSize = 1 }, ct);
        var hit = page.Items.FirstOrDefault(s => string.Equals(s.TrackingNumber, trackingNumber, StringComparison.OrdinalIgnoreCase));
        return hit is null ? NotFound() : Ok(hit);
    }
}
