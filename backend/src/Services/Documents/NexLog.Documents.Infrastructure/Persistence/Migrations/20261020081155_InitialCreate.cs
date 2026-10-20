using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexLog.Documents.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "documents");

            migrationBuilder.CreateTable(
                name: "document_items",
                schema: "documents",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    UploadedAt = table.Column<string>(type: "text", nullable: false),
                    Size = table.Column<string>(type: "text", nullable: false),
                    Icon = table.Column<string>(type: "text", nullable: false),
                    LoadId = table.Column<string>(type: "text", nullable: true),
                    OrderId = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_document_items", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "epod_records",
                schema: "documents",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    LoadId = table.Column<string>(type: "text", nullable: true),
                    Signature = table.Column<string>(type: "text", nullable: false),
                    PhotoUrl = table.Column<string>(type: "text", nullable: false),
                    GpsLat = table.Column<double>(type: "double precision", nullable: false),
                    GpsLng = table.Column<double>(type: "double precision", nullable: false),
                    Address = table.Column<string>(type: "text", nullable: false),
                    DeliveredAt = table.Column<string>(type: "text", nullable: false),
                    SignedBy = table.Column<string>(type: "text", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_epod_records", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_document_items_Status",
                schema: "documents",
                table: "document_items",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "document_items",
                schema: "documents");

            migrationBuilder.DropTable(
                name: "epod_records",
                schema: "documents");
        }
    }
}
