using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexLog.RouteOptimization.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "routing");

            migrationBuilder.CreateTable(
                name: "opt_routes",
                schema: "routing",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Color = table.Column<string>(type: "text", nullable: false),
                    Vehicle = table.Column<string>(type: "text", nullable: false),
                    Driver = table.Column<string>(type: "text", nullable: false),
                    DistanceKm = table.Column<decimal>(type: "numeric", nullable: false),
                    DurationMin = table.Column<int>(type: "integer", nullable: false),
                    Cost = table.Column<decimal>(type: "numeric", nullable: false),
                    LoadPct = table.Column<decimal>(type: "numeric", nullable: false),
                    Stops = table.Column<string>(type: "jsonb", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_opt_routes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "route_runs",
                schema: "routing",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Before = table.Column<string>(type: "jsonb", nullable: false),
                    After = table.Column<string>(type: "jsonb", nullable: false),
                    Co2SavedKg = table.Column<decimal>(type: "numeric", nullable: false),
                    LastRun = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_route_runs", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "opt_routes",
                schema: "routing");

            migrationBuilder.DropTable(
                name: "route_runs",
                schema: "routing");
        }
    }
}
