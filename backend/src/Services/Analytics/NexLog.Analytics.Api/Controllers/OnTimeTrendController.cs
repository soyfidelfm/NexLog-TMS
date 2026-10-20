using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.Analytics.Application.Dtos;
using NexLog.Analytics.Application.Services;

namespace NexLog.Analytics.Api.Controllers;

[Route("api/on-time-trends")]
public sealed class OnTimeTrendController(IOnTimeTrendService service) : CrudControllerBase<OnTimeTrendDto>(service)
{
    protected override string GetId(OnTimeTrendDto dto) => dto.Id!;
}
