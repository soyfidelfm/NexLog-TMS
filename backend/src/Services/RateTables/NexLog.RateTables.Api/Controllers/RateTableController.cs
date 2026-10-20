using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.RateTables.Application.Dtos;
using NexLog.RateTables.Application.Services;

namespace NexLog.RateTables.Api.Controllers;

[Route("api/rate-tables")]
public sealed class RateTableController(IRateTableService service) : CrudControllerBase<RateTableDto>(service)
{
    protected override string GetId(RateTableDto dto) => dto.Id!;
}
