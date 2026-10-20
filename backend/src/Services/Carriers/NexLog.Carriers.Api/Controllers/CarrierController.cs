using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.Carriers.Application.Dtos;
using NexLog.Carriers.Application.Services;

namespace NexLog.Carriers.Api.Controllers;

[Route("api/carriers")]
public sealed class CarrierController(ICarrierService service) : CrudControllerBase<CarrierDto>(service)
{
    protected override string GetId(CarrierDto dto) => dto.Id!;
}
