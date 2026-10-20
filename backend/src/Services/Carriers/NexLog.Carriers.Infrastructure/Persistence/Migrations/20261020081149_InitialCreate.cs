using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexLog.Carriers.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "carriers");

            migrationBuilder.CreateTable(
                name: "carriers",
                schema: "carriers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    OnTimePercent = table.Column<decimal>(type: "numeric", nullable: false),
                    ClaimsRate = table.Column<decimal>(type: "numeric", nullable: false),
                    Rating = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalLoads = table.Column<int>(type: "integer", nullable: false),
                    McNumber = table.Column<string>(type: "text", nullable: false),
                    DotNumber = table.Column<string>(type: "text", nullable: false),
                    Contact = table.Column<string>(type: "text", nullable: false),
                    Phone = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    City = table.Column<string>(type: "text", nullable: false),
                    State = table.Column<string>(type: "text", nullable: false),
                    Equipment = table.Column<List<string>>(type: "text[]", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_carriers", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_carriers_Status",
                schema: "carriers",
                table: "carriers",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "carriers",
                schema: "carriers");
        }
    }
}
