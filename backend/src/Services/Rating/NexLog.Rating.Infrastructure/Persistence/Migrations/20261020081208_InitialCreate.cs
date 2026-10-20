using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexLog.Rating.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "rating");

            migrationBuilder.CreateTable(
                name: "carrier_quotes",
                schema: "rating",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Carrier = table.Column<string>(type: "text", nullable: false),
                    Logo = table.Column<string>(type: "text", nullable: true),
                    Price = table.Column<decimal>(type: "numeric", nullable: false),
                    Currency = table.Column<string>(type: "text", nullable: false),
                    TransitDays = table.Column<int>(type: "integer", nullable: false),
                    ServiceType = table.Column<string>(type: "text", nullable: false),
                    OnTimePercent = table.Column<decimal>(type: "numeric", nullable: false),
                    Rating = table.Column<decimal>(type: "numeric", nullable: false),
                    FuelSurcharge = table.Column<decimal>(type: "numeric", nullable: false),
                    Total = table.Column<decimal>(type: "numeric", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_carrier_quotes", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "carrier_quotes",
                schema: "rating");
        }
    }
}
