using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.Exceptions.Application.Dtos;
using NexLog.Exceptions.Application.Services;

namespace NexLog.Exceptions.Api.Controllers;

[Route("api/exceptions")]
public sealed class ExceptionCaseController(IExceptionCaseService service) : CrudControllerBase<ExceptionItemDto>(service)
{
    protected override string GetId(ExceptionItemDto dto) => dto.Id!;
}
