using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.Orders.Application.Dtos;
using NexLog.Orders.Application.Services;

namespace NexLog.Orders.Api.Controllers;

[Route("api/orders")]
public sealed class OrderController(IOrderService service) : CrudControllerBase<OrderDto>(service)
{
    protected override string GetId(OrderDto dto) => dto.Id!;
}
