using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bakis.Migrations
{
    public partial class QuestionUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfileImageBase64",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<bool>(
                name: "IsBlocked",
                table: "Questions",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Questions",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsBlocked",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Questions");

            migrationBuilder.AddColumn<string>(
                name: "ProfileImageBase64",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
