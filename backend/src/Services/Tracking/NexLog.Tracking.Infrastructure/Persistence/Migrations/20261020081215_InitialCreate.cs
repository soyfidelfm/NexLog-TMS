using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexLog.Tracking.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "tracking");

            migrationBuilder.CreateTable(
                name: "shipments",
                schema: "tracking",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    OrderNumber = table.Column<string>(type: "text", nullable: false),
                    Origin = table.Column<string>(type: "text", nullable: false),
                    Destination = table.Column<string>(type: "text", nullable: false),
                    Driver = table.Column<string>(type: "text", nullable: false),
                    DriverPhone = table.Column<string>(type: "text", nullable: false),
                    Vehicle = table.Column<string>(type: "text", nullable: false),
                    Eta = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Progress = table.Column<int>(type: "integer", nullable: false),
                    Color = table.Column<string>(type: "text", nullable: false),
                    RoutePath = table.Column<string>(type: "text", nullable: false),
                    Position = table.Column<string>(type: "jsonb", nullable: false),
                    Alerts = table.Column<string>(type: "jsonb", nullable: false),
                    Timeline = table.Column<string>(type: "jsonb", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_shipments", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_shipments_Status",
                schema: "tracking",
                table: "shipments",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "shipments",
                schema: "tracking");
        }
    }
}
