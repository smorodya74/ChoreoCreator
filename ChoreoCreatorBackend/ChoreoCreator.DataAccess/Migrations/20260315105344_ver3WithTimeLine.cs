using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChoreoCreator.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class ver3WithTimeLine : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TotalDurationMs",
                table: "t_Scenarios",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalDurationMs",
                table: "t_Scenarios");
        }
    }
}
