using Microsoft.Extensions.DependencyInjection;
using NexLog.Tendering.Application.Services;
using NexLog.Tendering.Infrastructure.Persistence;

namespace NexLog.Tendering.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddTenderingInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<ITenderRepository, TenderRepository>();
        return services;
    }
}
