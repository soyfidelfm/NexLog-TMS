using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.ClientPortal.Application.Services;
using NexLog.ClientPortal.Domain.Entities;

namespace NexLog.ClientPortal.Infrastructure.Persistence;

public sealed class PortalShipmentRepository(ClientPortalDbContext db) : EfRepository<PortalShipment, ClientPortalDbContext>(db), IPortalShipmentRepository;
