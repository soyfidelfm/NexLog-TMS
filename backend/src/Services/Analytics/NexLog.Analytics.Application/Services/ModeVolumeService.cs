using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.Analytics.Application.Dtos;
using NexLog.Analytics.Domain.Entities;

namespace NexLog.Analytics.Application.Services;

public interface IModeVolumeRepository : IRepository<ModeVolume>;

public interface IModeVolumeService : ICrudService<ModeVolumeDto>;

public sealed class ModeVolumeService(IModeVolumeRepository repository) : CrudService<ModeVolume, ModeVolumeDto>(repository), IModeVolumeService
{
    protected override string EntityName => "ModeVolume";
    protected override string IdPrefix => "MV";
    protected override string? GetDtoId(ModeVolumeDto d) => d.Id;

    protected override ModeVolumeDto ToDto(ModeVolume e) => new(e.Id, e.Mode, e.Volume, e.Percentage, e.Cost);

    protected override void Apply(ModeVolumeDto d, ModeVolume e)
    {
        e.Mode = d.Mode;
        e.Volume = d.Volume;
        e.Percentage = d.Percentage;
        e.Cost = d.Cost;
    }

    protected override IQueryable<ModeVolume> Filter(IQueryable<ModeVolume> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.Mode.ToLower().Contains(s));
        }
        return q;
    }
}
