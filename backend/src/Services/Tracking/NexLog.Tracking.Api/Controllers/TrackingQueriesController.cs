using Microsoft.AspNetCore.Mvc;
using NexLog.Tracking.Application.Dtos;
using NexLog.Tracking.Application.Services;

namespace NexLog.Tracking.Api.Controllers;

[ApiController]
[Route("api/shipments/{id}/events")]
public sealed class ShipmentEventsController(IShipmentService shipments) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<NexLog.Tracking.Domain.ShipmentTimelineItem>>> Get(string id, CancellationToken ct)
    {
        var s = await shipments.GetByIdAsync(id, ct);
        return s.IsFailure ? NotFound() : Ok(s.Value!.Timeline);
    }

    /// <summary>Appends a tracking event (marks previous ones as not current).</summary>
    [HttpPost]
    public async Task<ActionResult<ShipmentDto>> Add(string id, [FromBody] NexLog.Tracking.Domain.ShipmentTimelineItem evt, CancellationToken ct)
    {
        var s = await shipments.GetByIdAsync(id, ct);
        if (s.IsFailure) return NotFound();
        var timeline = s.Value!.Timeline.Select(t => { t.Current = false; return t; }).ToList();
        timeline.Add(evt);
        var r = await shipments.UpdateAsync(id, s.Value with { Timeline = timeline }, ct);
        return Ok(r.Value);
    }
}
