using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.Rating.Application.Dtos;
using NexLog.Rating.Domain.Entities;

namespace NexLog.Rating.Application.Services;

public interface ICarrierQuoteRepository : IRepository<CarrierQuote>;

public interface ICarrierQuoteService : ICrudService<CarrierQuoteDto>;

public sealed class CarrierQuoteService(ICarrierQuoteRepository repository) : CrudService<CarrierQuote, CarrierQuoteDto>(repository), ICarrierQuoteService
{
    protected override string EntityName => "CarrierQuote";
    protected override string IdPrefix => "Q";
    protected override string? GetDtoId(CarrierQuoteDto d) => d.Id;

    protected override CarrierQuoteDto ToDto(CarrierQuote e) => new(e.Id, e.Carrier, e.Logo, e.Price, e.Currency, e.TransitDays, e.ServiceType, e.OnTimePercent, e.Rating, e.FuelSurcharge, e.Total, e.Notes);

    protected override void Apply(CarrierQuoteDto d, CarrierQuote e)
    {
        e.Carrier = d.Carrier;
        e.Logo = d.Logo;
        e.Price = d.Price;
        e.Currency = d.Currency;
        e.TransitDays = d.TransitDays;
        e.ServiceType = d.ServiceType;
        e.OnTimePercent = d.OnTimePercent;
        e.Rating = d.Rating;
        e.FuelSurcharge = d.FuelSurcharge;
        e.Total = d.Total;
        e.Notes = d.Notes;
    }

    protected override IQueryable<CarrierQuote> Filter(IQueryable<CarrierQuote> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.Carrier.ToLower().Contains(s) || e.ServiceType.ToLower().Contains(s));
        }
        return q;
    }
}
