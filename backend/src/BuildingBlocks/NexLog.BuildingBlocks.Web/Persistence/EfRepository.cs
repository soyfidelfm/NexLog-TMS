using Microsoft.EntityFrameworkCore;
using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.BuildingBlocks.Domain;

namespace NexLog.BuildingBlocks.Web.Persistence;

public class EfRepository<T, TContext>(TContext db) : IRepository<T> where T : Entity where TContext : DbContext
{
    protected TContext Db { get; } = db;
    protected DbSet<T> Set => Db.Set<T>();

    public async Task<PagedResult<T>> GetPagedAsync(Func<IQueryable<T>, IQueryable<T>> query, int page, int pageSize, CancellationToken ct = default)
    {
        var q = query(Set.AsNoTracking());
        var total = await q.CountAsync(ct);
        var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return new PagedResult<T>(items, page, pageSize, total);
    }

    public Task<List<T>> ListAsync(Func<IQueryable<T>, IQueryable<T>>? query = null, CancellationToken ct = default) =>
        (query is null ? Set.AsNoTracking() : query(Set.AsNoTracking())).ToListAsync(ct);

    public Task<T?> GetByIdAsync(string id, CancellationToken ct = default) => Set.FirstOrDefaultAsync(e => e.Id == id, ct);
    public Task<bool> ExistsAsync(string id, CancellationToken ct = default) => Set.AnyAsync(e => e.Id == id, ct);
    public async Task AddAsync(T entity, CancellationToken ct = default) { Set.Add(entity); await Db.SaveChangesAsync(ct); }
    public async Task UpdateAsync(T entity, CancellationToken ct = default) { Set.Update(entity); await Db.SaveChangesAsync(ct); }
    public async Task DeleteAsync(T entity, CancellationToken ct = default) { Set.Remove(entity); await Db.SaveChangesAsync(ct); }
}
