using Microsoft.Extensions.DependencyInjection;
using NexLog.Exceptions.Application.Services;

namespace NexLog.Exceptions.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddExceptionsApplication(this IServiceCollection services)
    {
        services.AddScoped<IExceptionCaseService, ExceptionCaseService>();
        return services;
    }
}
