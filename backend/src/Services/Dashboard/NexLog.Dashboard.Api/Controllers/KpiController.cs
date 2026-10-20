using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.Dashboard.Application.Dtos;
using NexLog.Dashboard.Application.Services;

namespace NexLog.Dashboard.Api.Controllers;

[Route("api/dashboard/kpis")]
public sealed class KpiController(IKpiService service) : CrudControllerBase<KpiDto>(service)
{
    protected override string GetId(KpiDto dto) => dto.Id!;
}
