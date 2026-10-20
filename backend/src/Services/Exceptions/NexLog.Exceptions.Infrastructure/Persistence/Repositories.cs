using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.Exceptions.Application.Services;
using NexLog.Exceptions.Domain.Entities;

namespace NexLog.Exceptions.Infrastructure.Persistence;

public sealed class ExceptionCaseRepository(ExceptionsDbContext db) : EfRepository<ExceptionCase, ExceptionsDbContext>(db), IExceptionCaseRepository;
