using Microsoft.AspNetCore.Mvc;
using NexLog.Rating.Application.Dtos;
using NexLog.Rating.Application.Services;

namespace NexLog.Rating.Api.Controllers;

[ApiController]
[Route("api/quotes/search")]
public sealed class QuoteSearchController(ICarrierQuoteService quotes) : ControllerBase
{
    /// <summary>Returns carrier quotes for a QuoteRequest (rates scaled by weight vs. a 10,000 lb baseline).</summary>
    [HttpPost]
    public async Task<ActionResult<List<CarrierQuoteDto>>> Search([FromBody] NexLog.Rating.Domain.QuoteRequest request, CancellationToken ct)
    {
        var factor = request.Weight <= 0 ? 1m : Math.Max(0.5m, request.Weight / 10000m);
        var list = (await quotes.GetAllAsync(ct))
            .Select(q => q with { Price = Math.Round(q.Price * factor, 2), FuelSurcharge = Math.Round(q.FuelSurcharge * factor, 2), Total = Math.Round(q.Total * factor, 2) })
            .OrderBy(q => q.Total).ToList();
        return Ok(list);
    }
}
