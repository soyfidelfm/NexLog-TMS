using Microsoft.Extensions.DependencyInjection;
using NexLog.FreightAudit.Application.Services;

namespace NexLog.FreightAudit.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddFreightAuditApplication(this IServiceCollection services)
    {
        services.AddScoped<IFreightInvoiceService, FreightInvoiceService>();
        return services;
    }
}
