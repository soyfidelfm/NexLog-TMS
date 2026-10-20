using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.Dashboard.Application.Services;
using NexLog.Dashboard.Domain.Entities;

namespace NexLog.Dashboard.Infrastructure.Persistence;

public sealed class KpiRepository(DashboardDbContext db) : EfRepository<Kpi, DashboardDbContext>(db), IKpiRepository;

public sealed class DashboardAlertRepository(DashboardDbContext db) : EfRepository<DashboardAlert, DashboardDbContext>(db), IDashboardAlertRepository;
