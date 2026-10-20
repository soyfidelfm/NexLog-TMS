using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.Loads.Application.Dtos;
using NexLog.Loads.Application.Services;

namespace NexLog.Loads.Api.Controllers;

[Route("api/trailers")]
public sealed class TrailerController(ITrailerService service) : CrudControllerBase<TrailerDto>(service)
{
    protected override string GetId(TrailerDto dto) => dto.Id!;
}
