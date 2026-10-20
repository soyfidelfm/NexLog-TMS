using Microsoft.Extensions.DependencyInjection;
using NexLog.ClientPortal.Application.Services;

namespace NexLog.ClientPortal.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddClientPortalApplication(this IServiceCollection services)
    {
        services.AddScoped<IPortalShipmentService, PortalShipmentService>();
        return services;
    }
}
