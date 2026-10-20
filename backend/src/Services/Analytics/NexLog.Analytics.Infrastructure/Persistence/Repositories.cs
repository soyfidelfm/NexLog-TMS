using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.Analytics.Application.Services;
using NexLog.Analytics.Domain.Entities;

namespace NexLog.Analytics.Infrastructure.Persistence;

public sealed class LaneCostRepository(AnalyticsDbContext db) : EfRepository<LaneCost, AnalyticsDbContext>(db), ILaneCostRepository;

public sealed class CarrierPerformanceRepository(AnalyticsDbContext db) : EfRepository<CarrierPerformance, AnalyticsDbContext>(db), ICarrierPerformanceRepository;

public sealed class OnTimeTrendRepository(AnalyticsDbContext db) : EfRepository<OnTimeTrend, AnalyticsDbContext>(db), IOnTimeTrendRepository;

public sealed class ModeVolumeRepository(AnalyticsDbContext db) : EfRepository<ModeVolume, AnalyticsDbContext>(db), IModeVolumeRepository;
