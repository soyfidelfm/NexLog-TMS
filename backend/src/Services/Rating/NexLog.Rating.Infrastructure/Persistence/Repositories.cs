using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.Rating.Application.Services;
using NexLog.Rating.Domain.Entities;

namespace NexLog.Rating.Infrastructure.Persistence;

public sealed class CarrierQuoteRepository(RatingDbContext db) : EfRepository<CarrierQuote, RatingDbContext>(db), ICarrierQuoteRepository;
