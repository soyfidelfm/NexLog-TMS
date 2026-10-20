using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.Tendering.Application.Services;
using NexLog.Tendering.Domain.Entities;

namespace NexLog.Tendering.Infrastructure.Persistence;

public sealed class TenderRepository(TenderingDbContext db) : EfRepository<Tender, TenderingDbContext>(db), ITenderRepository;
