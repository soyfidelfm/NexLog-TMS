using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.Orders.Application.Dtos;
using NexLog.Orders.Application.Services;

namespace NexLog.Orders.Api.Controllers;

[Route("api/order-details")]
public sealed class OrderDetailController(IOrderDetailService service) : CrudControllerBase<OrderDetailDto>(service)
{
    protected override string GetId(OrderDetailDto dto) => dto.Id!;
}
