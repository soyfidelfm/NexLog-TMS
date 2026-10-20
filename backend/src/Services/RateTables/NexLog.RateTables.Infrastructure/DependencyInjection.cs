using Microsoft.Extensions.DependencyInjection;
using NexLog.RateTables.Application.Services;
using NexLog.RateTables.Infrastructure.Persistence;

namespace NexLog.RateTables.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddRateTablesInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IRateTableRepository, RateTableRepository>();
        services.AddScoped<IRolePermissionRepository, RolePermissionRepository>();
        return services;
    }
}
