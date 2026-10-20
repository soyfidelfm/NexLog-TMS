using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.Dashboard.Application.Dtos;
using NexLog.Dashboard.Application.Services;

namespace NexLog.Dashboard.Api.Controllers;

[Route("api/dashboard/alerts")]
public sealed class DashboardAlertController(IDashboardAlertService service) : CrudControllerBase<AlertDto>(service)
{
    protected override string GetId(AlertDto dto) => dto.Id!;
}
