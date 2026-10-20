using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.Rating.Application.Dtos;
using NexLog.Rating.Application.Services;

namespace NexLog.Rating.Api.Controllers;

[Route("api/quotes")]
public sealed class CarrierQuoteController(ICarrierQuoteService service) : CrudControllerBase<CarrierQuoteDto>(service)
{
    protected override string GetId(CarrierQuoteDto dto) => dto.Id!;
}
