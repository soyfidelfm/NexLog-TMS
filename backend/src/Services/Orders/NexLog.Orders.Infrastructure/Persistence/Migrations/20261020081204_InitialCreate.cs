using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexLog.Orders.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "orders");

            migrationBuilder.CreateTable(
                name: "order_details",
                schema: "orders",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Origin = table.Column<string>(type: "jsonb", nullable: false),
                    Destination = table.Column<string>(type: "jsonb", nullable: false),
                    WeightLbs = table.Column<decimal>(type: "numeric", nullable: false),
                    WeightKg = table.Column<decimal>(type: "numeric", nullable: false),
                    Dimensions = table.Column<string>(type: "jsonb", nullable: false),
                    ProductType = table.Column<string>(type: "text", nullable: false),
                    SpecialRequirements = table.Column<List<string>>(type: "text[]", nullable: false),
                    RouteDistanceMi = table.Column<decimal>(type: "numeric", nullable: false),
                    RouteDistanceKm = table.Column<decimal>(type: "numeric", nullable: false),
                    TransitTime = table.Column<string>(type: "text", nullable: false),
                    EstimatedArrival = table.Column<string>(type: "text", nullable: false),
                    Timeline = table.Column<string>(type: "jsonb", nullable: false),
                    Items = table.Column<string>(type: "jsonb", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_order_details", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "orders",
                schema: "orders",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Origin = table.Column<string>(type: "jsonb", nullable: false),
                    Destination = table.Column<string>(type: "jsonb", nullable: false),
                    Weight = table.Column<decimal>(type: "numeric", nullable: false),
                    Volume = table.Column<decimal>(type: "numeric", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Carrier = table.Column<string>(type: "text", nullable: false),
                    Eta = table.Column<string>(type: "text", nullable: false),
                    Priority = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_orders", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_order_details_Status",
                schema: "orders",
                table: "order_details",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_orders_Status",
                schema: "orders",
                table: "orders",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "order_details",
                schema: "orders");

            migrationBuilder.DropTable(
                name: "orders",
                schema: "orders");
        }
    }
}
