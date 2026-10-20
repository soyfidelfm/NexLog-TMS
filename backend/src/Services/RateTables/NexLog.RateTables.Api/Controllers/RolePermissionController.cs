using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.RateTables.Application.Dtos;
using NexLog.RateTables.Application.Services;

namespace NexLog.RateTables.Api.Controllers;

[Route("api/role-permissions")]
public sealed class RolePermissionController(IRolePermissionService service) : CrudControllerBase<RolePermissionDto>(service)
{
    protected override string GetId(RolePermissionDto dto) => dto.Id!;
}
