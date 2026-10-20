using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexLog.ClientPortal.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "client_portal");

            migrationBuilder.CreateTable(
                name: "portal_shipments",
                schema: "client_portal",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    TrackingNumber = table.Column<string>(type: "text", nullable: false),
                    Origin = table.Column<string>(type: "text", nullable: false),
                    Destination = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Progress = table.Column<int>(type: "integer", nullable: false),
                    Eta = table.Column<string>(type: "text", nullable: false),
                    Documents = table.Column<string>(type: "jsonb", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_portal_shipments", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_portal_shipments_Status",
                schema: "client_portal",
                table: "portal_shipments",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "portal_shipments",
                schema: "client_portal");
        }
    }
}
