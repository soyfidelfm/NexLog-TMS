using Microsoft.AspNetCore.Mvc;
using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;

namespace NexLog.BuildingBlocks.Web.Api;

/// <summary>Async CRUD endpoints: GET (paged+filter), GET {id}, POST, PUT {id}, DELETE {id}.</summary>
[ApiController]
[Produces("application/json")]
public abstract class CrudControllerBase<TDto>(ICrudService<TDto> service) : ControllerBase
{
    protected ICrudService<TDto> Service { get; } = service;

    [HttpGet]
    public async Task<ActionResult<PagedResult<TDto>>> List([FromQuery] PageQuery query, CancellationToken ct) =>
        Ok(await Service.GetPagedAsync(query, ct));

    [HttpGet("{id}")]
    public async Task<ActionResult<TDto>> Get(string id, CancellationToken ct) => ToAction(await Service.GetByIdAsync(id, ct));

    [HttpPost]
    public async Task<ActionResult<TDto>> Create([FromBody] TDto dto, CancellationToken ct)
    {
        var r = await Service.CreateAsync(dto, ct);
        if (r.IsFailure) return Problem(r.Error);
        return CreatedAtAction(nameof(Get), new { id = GetId(r.Value!) }, r.Value);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TDto>> Update(string id, [FromBody] TDto dto, CancellationToken ct) =>
        ToAction(await Service.UpdateAsync(id, dto, ct));

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        var r = await Service.DeleteAsync(id, ct);
        return r.IsSuccess ? NoContent() : Problem(r.Error);
    }

    protected abstract string GetId(TDto dto);

    protected ActionResult<TDto> ToAction(Result<TDto> r) => r.IsSuccess ? Ok(r.Value) : Problem(r.Error);

    protected ObjectResult Problem(Error e) => e.Code switch
    {
        "not_found" => Problem(detail: e.Message, statusCode: 404, title: "Not Found"),
        "conflict" => Problem(detail: e.Message, statusCode: 409, title: "Conflict"),
        _ => Problem(detail: e.Message, statusCode: 400, title: "Bad Request"),
    };
}
