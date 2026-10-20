using Microsoft.AspNetCore.Mvc;
using NexLog.Analytics.Application.Dtos;
using NexLog.Analytics.Application.Services;

namespace NexLog.Analytics.Api.Controllers;

public sealed record AnalyticsDataDto(List<LaneCostDto> LaneCosts, List<CarrierPerformanceDto> CarrierPerformance, List<OnTimeTrendDto> OnTimeTrends, List<ModeVolumeDto> ModeVolumes);

[ApiController]
[Route("api/analytics")]
public sealed class AnalyticsSummaryController(ILaneCostService lanes, ICarrierPerformanceService carriers, IOnTimeTrendService trends, IModeVolumeService modes) : ControllerBase
{
    /// <summary>Aggregated payload matching the frontend AnalyticsData interface.</summary>
    [HttpGet]
    public async Task<ActionResult<AnalyticsDataDto>> Get(CancellationToken ct) =>
        Ok(new AnalyticsDataDto(await lanes.GetAllAsync(ct), await carriers.GetAllAsync(ct), await trends.GetAllAsync(ct), await modes.GetAllAsync(ct)));
}
