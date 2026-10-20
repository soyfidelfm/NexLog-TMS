using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.Analytics.Application.Dtos;
using NexLog.Analytics.Application.Services;

namespace NexLog.Analytics.Api.Controllers;

[Route("api/lane-costs")]
public sealed class LaneCostController(ILaneCostService service) : CrudControllerBase<LaneCostDto>(service)
{
    protected override string GetId(LaneCostDto dto) => dto.Id!;
}
