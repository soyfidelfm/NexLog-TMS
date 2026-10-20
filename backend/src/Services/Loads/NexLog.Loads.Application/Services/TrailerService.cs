using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.Loads.Application.Dtos;
using NexLog.Loads.Domain.Entities;

namespace NexLog.Loads.Application.Services;

public interface ITrailerRepository : IRepository<Trailer>;

public interface ITrailerService : ICrudService<TrailerDto>;

public sealed class TrailerService(ITrailerRepository repository) : CrudService<Trailer, TrailerDto>(repository), ITrailerService
{
    protected override string EntityName => "Trailer";
    protected override string IdPrefix => "TR";
    protected override string? GetDtoId(TrailerDto d) => d.Id;

    protected override TrailerDto ToDto(Trailer e) => new(e.Id, e.Name, e.Type, e.MaxWeight, e.MaxVolume, e.Assigned);

    protected override void Apply(TrailerDto d, Trailer e)
    {
        e.Name = d.Name;
        e.Type = d.Type;
        e.MaxWeight = d.MaxWeight;
        e.MaxVolume = d.MaxVolume;
        e.Assigned = d.Assigned;
    }

    protected override IQueryable<Trailer> Filter(IQueryable<Trailer> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.Name.ToLower().Contains(s) || e.Type.ToLower().Contains(s));
        }
        return q;
    }
}
