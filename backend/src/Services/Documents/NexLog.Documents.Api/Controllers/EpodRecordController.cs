using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.Documents.Application.Dtos;
using NexLog.Documents.Application.Services;

namespace NexLog.Documents.Api.Controllers;

[Route("api/epods")]
public sealed class EpodRecordController(IEpodRecordService service) : CrudControllerBase<EpodDto>(service)
{
    protected override string GetId(EpodDto dto) => dto.Id!;
}
