using Microsoft.Extensions.DependencyInjection;
using NexLog.Carriers.Application.Services;
using NexLog.Carriers.Infrastructure.Persistence;

namespace NexLog.Carriers.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddCarriersInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<ICarrierRepository, CarrierRepository>();
        return services;
    }
}
