using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.Carriers.Application.Services;
using NexLog.Carriers.Domain.Entities;

namespace NexLog.Carriers.Infrastructure.Persistence;

public sealed class CarrierRepository(CarriersDbContext db) : EfRepository<Carrier, CarriersDbContext>(db), ICarrierRepository;
