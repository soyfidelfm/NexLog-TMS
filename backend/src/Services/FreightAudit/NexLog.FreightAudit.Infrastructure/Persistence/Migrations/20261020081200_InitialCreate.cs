using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexLog.FreightAudit.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "freight_audit");

            migrationBuilder.CreateTable(
                name: "freight_invoices",
                schema: "freight_audit",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Carrier = table.Column<string>(type: "text", nullable: false),
                    LoadId = table.Column<string>(type: "text", nullable: false),
                    InvoiceDate = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Lines = table.Column<string>(type: "jsonb", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_freight_invoices", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_freight_invoices_Status",
                schema: "freight_audit",
                table: "freight_invoices",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "freight_invoices",
                schema: "freight_audit");
        }
    }
}
