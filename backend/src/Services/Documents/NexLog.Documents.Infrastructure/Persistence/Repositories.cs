using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.Documents.Application.Services;
using NexLog.Documents.Domain.Entities;

namespace NexLog.Documents.Infrastructure.Persistence;

public sealed class DocumentItemRepository(DocumentsDbContext db) : EfRepository<DocumentItem, DocumentsDbContext>(db), IDocumentItemRepository;

public sealed class EpodRecordRepository(DocumentsDbContext db) : EfRepository<EpodRecord, DocumentsDbContext>(db), IEpodRecordRepository;
