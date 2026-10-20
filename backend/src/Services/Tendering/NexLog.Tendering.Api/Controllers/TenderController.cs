using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.Tendering.Application.Dtos;
using NexLog.Tendering.Application.Services;

namespace NexLog.Tendering.Api.Controllers;

[Route("api/tenders")]
public sealed class TenderController(ITenderService service) : CrudControllerBase<TenderDto>(service)
{
    protected override string GetId(TenderDto dto) => dto.Id!;
}
