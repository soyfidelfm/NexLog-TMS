using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.Loads.Application.Dtos;
using NexLog.Loads.Application.Services;

namespace NexLog.Loads.Api.Controllers;

[Route("api/loads")]
public sealed class LoadController(ILoadService service) : CrudControllerBase<LoadDto>(service)
{
    protected override string GetId(LoadDto dto) => dto.Id!;
}
