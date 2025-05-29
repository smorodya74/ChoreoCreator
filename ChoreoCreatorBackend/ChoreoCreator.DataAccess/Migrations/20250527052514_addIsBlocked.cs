﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChoreoCreator.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class addIsBlocked : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsBlocked",
                table: "t_Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsBlocked",
                table: "t_Users");
        }
    }
}
