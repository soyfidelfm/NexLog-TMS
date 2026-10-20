using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexLog.Analytics.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "analytics");

            migrationBuilder.CreateTable(
                name: "carrier_performances",
                schema: "analytics",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Carrier = table.Column<string>(type: "text", nullable: false),
                    OnTimePercent = table.Column<decimal>(type: "numeric", nullable: false),
                    AvgCost = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalVolume = table.Column<int>(type: "integer", nullable: false),
                    Claims = table.Column<int>(type: "integer", nullable: false),
                    Score = table.Column<decimal>(type: "numeric", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_carrier_performances", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "lane_costs",
                schema: "analytics",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Lane = table.Column<string>(type: "text", nullable: false),
                    Origin = table.Column<string>(type: "text", nullable: false),
                    Destination = table.Column<string>(type: "text", nullable: false),
                    AvgCost = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalCost = table.Column<decimal>(type: "numeric", nullable: false),
                    Volume = table.Column<int>(type: "integer", nullable: false),
                    Mode = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lane_costs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "mode_volumes",
                schema: "analytics",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Mode = table.Column<string>(type: "text", nullable: false),
                    Volume = table.Column<int>(type: "integer", nullable: false),
                    Percentage = table.Column<decimal>(type: "numeric", nullable: false),
                    Cost = table.Column<decimal>(type: "numeric", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mode_volumes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "on_time_trends",
                schema: "analytics",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Period = table.Column<string>(type: "text", nullable: false),
                    OnTimePercent = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalDeliveries = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_on_time_trends", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "carrier_performances",
                schema: "analytics");

            migrationBuilder.DropTable(
                name: "lane_costs",
                schema: "analytics");

            migrationBuilder.DropTable(
                name: "mode_volumes",
                schema: "analytics");

            migrationBuilder.DropTable(
                name: "on_time_trends",
                schema: "analytics");
        }
    }
}
