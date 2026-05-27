using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChoreoCreator.DataAccess.Migrations
{
    public partial class NormalizeUserEmail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE "t_Users"
                SET "Email" = lower(trim("Email"));
                """);

            migrationBuilder.Sql("""
                CREATE UNIQUE INDEX IF NOT EXISTS "IX_t_Users_Email_Lower"
                ON "t_Users" (lower("Email"));
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DROP INDEX IF EXISTS "IX_t_Users_Email_Lower";
                """);
        }
    }
}
