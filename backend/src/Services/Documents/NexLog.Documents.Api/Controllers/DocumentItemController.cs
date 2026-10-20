using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.Documents.Application.Dtos;
using NexLog.Documents.Application.Services;

namespace NexLog.Documents.Api.Controllers;

[Route("api/documents")]
public sealed class DocumentItemController(IDocumentItemService service) : CrudControllerBase<DocumentItemDto>(service)
{
    protected override string GetId(DocumentItemDto dto) => dto.Id!;
}
