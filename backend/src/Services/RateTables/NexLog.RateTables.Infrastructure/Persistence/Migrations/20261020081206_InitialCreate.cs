using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexLog.RateTables.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "rate_tables");

            migrationBuilder.CreateTable(
                name: "rate_tables",
                schema: "rate_tables",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Carrier = table.Column<string>(type: "text", nullable: false),
                    OriginZone = table.Column<string>(type: "text", nullable: false),
                    DestinationZone = table.Column<string>(type: "text", nullable: false),
                    Mode = table.Column<string>(type: "text", nullable: false),
                    RateType = table.Column<string>(type: "text", nullable: false),
                    BaseRate = table.Column<decimal>(type: "numeric", nullable: false),
                    MinCharge = table.Column<decimal>(type: "numeric", nullable: false),
                    FuelSurcharge = table.Column<decimal>(type: "numeric", nullable: false),
                    EffectiveFrom = table.Column<string>(type: "text", nullable: false),
                    EffectiveTo = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rate_tables", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "role_permissions",
                schema: "rate_tables",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    View = table.Column<bool>(type: "boolean", nullable: false),
                    CreateEdit = table.Column<bool>(type: "boolean", nullable: false),
                    Delete = table.Column<bool>(type: "boolean", nullable: false),
                    Approve = table.Column<bool>(type: "boolean", nullable: false),
                    Export = table.Column<bool>(type: "boolean", nullable: false),
                    ManagePermissions = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_role_permissions", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_rate_tables_Status",
                schema: "rate_tables",
                table: "rate_tables",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "rate_tables",
                schema: "rate_tables");

            migrationBuilder.DropTable(
                name: "role_permissions",
                schema: "rate_tables");
        }
    }
}
