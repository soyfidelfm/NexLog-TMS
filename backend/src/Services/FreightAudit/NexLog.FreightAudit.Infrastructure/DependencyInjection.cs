using Microsoft.Extensions.DependencyInjection;
using NexLog.FreightAudit.Application.Services;
using NexLog.FreightAudit.Infrastructure.Persistence;

namespace NexLog.FreightAudit.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddFreightAuditInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IFreightInvoiceRepository, FreightInvoiceRepository>();
        return services;
    }
}
