using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.Carriers.Application.Dtos;
using NexLog.Carriers.Domain.Entities;

namespace NexLog.Carriers.Application.Services;

public interface ICarrierRepository : IRepository<Carrier>;

public interface ICarrierService : ICrudService<CarrierDto>;

public sealed class CarrierService(ICarrierRepository repository) : CrudService<Carrier, CarrierDto>(repository), ICarrierService
{
    protected override string EntityName => "Carrier";
    protected override string IdPrefix => "CR";
    protected override string? GetDtoId(CarrierDto d) => d.Id;

    protected override CarrierDto ToDto(Carrier e) => new(e.Id, e.Name, e.Code, e.Status, e.OnTimePercent, e.ClaimsRate, e.Rating, e.TotalLoads, e.McNumber, e.DotNumber, e.Contact, e.Phone, e.Email, e.City, e.State, e.Equipment, e.Notes);

    protected override void Apply(CarrierDto d, Carrier e)
    {
        e.Name = d.Name;
        e.Code = d.Code;
        e.Status = d.Status;
        e.OnTimePercent = d.OnTimePercent;
        e.ClaimsRate = d.ClaimsRate;
        e.Rating = d.Rating;
        e.TotalLoads = d.TotalLoads;
        e.McNumber = d.McNumber;
        e.DotNumber = d.DotNumber;
        e.Contact = d.Contact;
        e.Phone = d.Phone;
        e.Email = d.Email;
        e.City = d.City;
        e.State = d.State;
        e.Equipment = d.Equipment;
        e.Notes = d.Notes;
    }

    protected override IQueryable<Carrier> Filter(IQueryable<Carrier> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.Name.ToLower().Contains(s) || e.Code.ToLower().Contains(s) || e.City.ToLower().Contains(s));
        }
        if (!string.IsNullOrWhiteSpace(p.Status)) q = q.Where(e => e.Status == p.Status);
        return q;
    }
}
