using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexLog.Loads.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "loads");

            migrationBuilder.CreateTable(
                name: "loads",
                schema: "loads",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Origin = table.Column<string>(type: "text", nullable: false),
                    Destination = table.Column<string>(type: "text", nullable: false),
                    Weight = table.Column<decimal>(type: "numeric", nullable: false),
                    Volume = table.Column<decimal>(type: "numeric", nullable: false),
                    PickupDate = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    SelectedCarrier = table.Column<string>(type: "text", nullable: true),
                    TenderedAt = table.Column<string>(type: "text", nullable: true),
                    CascadeCount = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_loads", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "planning_orders",
                schema: "loads",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Customer = table.Column<string>(type: "text", nullable: false),
                    Origin = table.Column<string>(type: "text", nullable: false),
                    Destination = table.Column<string>(type: "text", nullable: false),
                    Weight = table.Column<decimal>(type: "numeric", nullable: false),
                    Volume = table.Column<decimal>(type: "numeric", nullable: false),
                    Priority = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_planning_orders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "trailers",
                schema: "loads",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    MaxWeight = table.Column<decimal>(type: "numeric", nullable: false),
                    MaxVolume = table.Column<decimal>(type: "numeric", nullable: false),
                    Assigned = table.Column<string>(type: "jsonb", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trailers", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_loads_Status",
                schema: "loads",
                table: "loads",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_planning_orders_Priority",
                schema: "loads",
                table: "planning_orders",
                column: "Priority");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "loads",
                schema: "loads");

            migrationBuilder.DropTable(
                name: "planning_orders",
                schema: "loads");

            migrationBuilder.DropTable(
                name: "trailers",
                schema: "loads");
        }
    }
}
