using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexLog.Exceptions.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "exceptions");

            migrationBuilder.CreateTable(
                name: "exception_cases",
                schema: "exceptions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    LoadId = table.Column<string>(type: "text", nullable: false),
                    OrderId = table.Column<string>(type: "text", nullable: true),
                    Carrier = table.Column<string>(type: "text", nullable: false),
                    Severity = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    OpenedAt = table.Column<string>(type: "text", nullable: false),
                    LastUpdate = table.Column<string>(type: "text", nullable: false),
                    Location = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Timeline = table.Column<string>(type: "jsonb", nullable: false),
                    Actions = table.Column<string>(type: "jsonb", nullable: false),
                    Communications = table.Column<string>(type: "jsonb", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_exception_cases", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_exception_cases_Status",
                schema: "exceptions",
                table: "exception_cases",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "exception_cases",
                schema: "exceptions");
        }
    }
}
