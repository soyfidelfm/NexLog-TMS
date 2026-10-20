using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.RateTables.Application.Services;
using NexLog.RateTables.Domain.Entities;

namespace NexLog.RateTables.Infrastructure.Persistence;

public sealed class RateTableRepository(RateTablesDbContext db) : EfRepository<RateTable, RateTablesDbContext>(db), IRateTableRepository;

public sealed class RolePermissionRepository(RateTablesDbContext db) : EfRepository<RolePermission, RateTablesDbContext>(db), IRolePermissionRepository;
