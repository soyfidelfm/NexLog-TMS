using Microsoft.Extensions.DependencyInjection;
using NexLog.Exceptions.Application.Services;
using NexLog.Exceptions.Infrastructure.Persistence;

namespace NexLog.Exceptions.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddExceptionsInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IExceptionCaseRepository, ExceptionCaseRepository>();
        return services;
    }
}
