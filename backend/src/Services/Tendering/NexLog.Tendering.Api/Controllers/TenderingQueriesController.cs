using Microsoft.AspNetCore.Mvc;
using NexLog.Tendering.Application.Dtos;
using NexLog.Tendering.Application.Services;

namespace NexLog.Tendering.Api.Controllers;

[ApiController]
[Route("api/tenders/{id}")]
public sealed class TenderActionsController(ITenderService tenders) : ControllerBase
{
    [HttpPost("accept")]
    public async Task<ActionResult<TenderDto>> Accept(string id, CancellationToken ct)
    {
        var t = await tenders.GetByIdAsync(id, ct);
        if (t.IsFailure) return NotFound();
        var r = await tenders.UpdateAsync(id, t.Value! with { Status = "Accepted" }, ct);
        return Ok(r.Value);
    }

    /// <summary>Rejects the current carrier and cascades to the next one in CarrierSequence.</summary>
    [HttpPost("reject")]
    public async Task<ActionResult<TenderDto>> Reject(string id, CancellationToken ct)
    {
        var t = await tenders.GetByIdAsync(id, ct);
        if (t.IsFailure) return NotFound();
        var v = t.Value!;
        var idx = v.SelectedCarrier is null ? -1 : v.CarrierSequence.IndexOf(v.SelectedCarrier);
        var next = idx + 1 < v.CarrierSequence.Count ? v.CarrierSequence[idx + 1] : null;
        var updated = next is null
            ? v with { Status = "Rejected" }
            : v with { Status = "Pending", SelectedCarrier = next, CascadeCount = v.CascadeCount + 1, TenderedAt = DateTime.UtcNow.ToString("s") };
        var r = await tenders.UpdateAsync(id, updated, ct);
        return Ok(r.Value);
    }
}
