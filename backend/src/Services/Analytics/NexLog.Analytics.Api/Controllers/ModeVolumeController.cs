using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.Analytics.Application.Dtos;
using NexLog.Analytics.Application.Services;

namespace NexLog.Analytics.Api.Controllers;

[Route("api/mode-volumes")]
public sealed class ModeVolumeController(IModeVolumeService service) : CrudControllerBase<ModeVolumeDto>(service)
{
    protected override string GetId(ModeVolumeDto dto) => dto.Id!;
}
