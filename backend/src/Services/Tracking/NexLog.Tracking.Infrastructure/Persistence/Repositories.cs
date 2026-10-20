using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.Tracking.Application.Services;
using NexLog.Tracking.Domain.Entities;

namespace NexLog.Tracking.Infrastructure.Persistence;

public sealed class ShipmentRepository(TrackingDbContext db) : EfRepository<Shipment, TrackingDbContext>(db), IShipmentRepository;
