using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.Analytics.Application.Dtos;
using NexLog.Analytics.Application.Services;

namespace NexLog.Analytics.Api.Controllers;

[Route("api/carrier-performance")]
public sealed class CarrierPerformanceController(ICarrierPerformanceService service) : CrudControllerBase<CarrierPerformanceDto>(service)
{
    protected override string GetId(CarrierPerformanceDto dto) => dto.Id!;
}
