using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.RateTables.Application.Dtos;
using NexLog.RateTables.Domain.Entities;

namespace NexLog.RateTables.Application.Services;

public interface IRolePermissionRepository : IRepository<RolePermission>;

public interface IRolePermissionService : ICrudService<RolePermissionDto>;

public sealed class RolePermissionService(IRolePermissionRepository repository) : CrudService<RolePermission, RolePermissionDto>(repository), IRolePermissionService
{
    protected override string EntityName => "RolePermission";
    protected override string IdPrefix => "ROLE";
    protected override string? GetDtoId(RolePermissionDto d) => d.Id;

    protected override RolePermissionDto ToDto(RolePermission e) => new(e.Id, e.Role, e.Description, e.View, e.CreateEdit, e.Delete, e.Approve, e.Export, e.ManagePermissions);

    protected override void Apply(RolePermissionDto d, RolePermission e)
    {
        e.Role = d.Role;
        e.Description = d.Description;
        e.View = d.View;
        e.CreateEdit = d.CreateEdit;
        e.Delete = d.Delete;
        e.Approve = d.Approve;
        e.Export = d.Export;
        e.ManagePermissions = d.ManagePermissions;
    }

    protected override IQueryable<RolePermission> Filter(IQueryable<RolePermission> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.Role.ToLower().Contains(s));
        }
        return q;
    }
}
