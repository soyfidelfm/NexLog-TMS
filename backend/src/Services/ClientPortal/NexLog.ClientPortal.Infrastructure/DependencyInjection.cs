using Microsoft.Extensions.DependencyInjection;
using NexLog.ClientPortal.Application.Services;
using NexLog.ClientPortal.Infrastructure.Persistence;

namespace NexLog.ClientPortal.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddClientPortalInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IPortalShipmentRepository, PortalShipmentRepository>();
        return services;
    }
}
