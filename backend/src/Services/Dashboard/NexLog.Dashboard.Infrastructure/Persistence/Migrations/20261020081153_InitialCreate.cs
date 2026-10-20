using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexLog.Dashboard.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "dashboard");

            migrationBuilder.CreateTable(
                name: "dashboard_alerts",
                schema: "dashboard",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    TitleKey = table.Column<string>(type: "text", nullable: false),
                    DescKey = table.Column<string>(type: "text", nullable: false),
                    TimeKey = table.Column<string>(type: "text", nullable: false),
                    N = table.Column<int>(type: "integer", nullable: false),
                    Icon = table.Column<string>(type: "text", nullable: false),
                    Color = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dashboard_alerts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "kpis",
                schema: "dashboard",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    TitleKey = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false),
                    ChangeKey = table.Column<string>(type: "text", nullable: false),
                    ChangeParams = table.Column<string>(type: "jsonb", nullable: false),
                    ChangePositive = table.Column<bool>(type: "boolean", nullable: false),
                    Icon = table.Column<string>(type: "text", nullable: false),
                    Color = table.Column<string>(type: "text", nullable: false),
                    Sparkline = table.Column<string>(type: "jsonb", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_kpis", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_dashboard_alerts_Type",
                schema: "dashboard",
                table: "dashboard_alerts",
                column: "Type");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "dashboard_alerts",
                schema: "dashboard");

            migrationBuilder.DropTable(
                name: "kpis",
                schema: "dashboard");
        }
    }
}
