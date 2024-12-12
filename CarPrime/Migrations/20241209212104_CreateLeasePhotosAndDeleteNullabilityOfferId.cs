using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarPrime.Migrations
{
    /// <inheritdoc />
    public partial class CreateLeasePhotosAndDeleteNullabilityOfferId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Leases_Offers_OfferId",
                table: "Leases");

            migrationBuilder.DropColumn(
                name: "FilePath",
                table: "LeaseReturns");

            migrationBuilder.AlterColumn<int>(
                name: "OfferId",
                table: "Leases",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "LeaseReturnPhotos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LeaseReturnId = table.Column<int>(type: "int", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeaseReturnPhotos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LeaseReturnPhotos_LeaseReturns_LeaseReturnId",
                        column: x => x.LeaseReturnId,
                        principalTable: "LeaseReturns",
                        principalColumn: "LeaseId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LeaseReturnPhotos_LeaseReturnId",
                table: "LeaseReturnPhotos",
                column: "LeaseReturnId");

            migrationBuilder.AddForeignKey(
                name: "FK_Leases_Offers_OfferId",
                table: "Leases",
                column: "OfferId",
                principalTable: "Offers",
                principalColumn: "OfferId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Leases_Offers_OfferId",
                table: "Leases");

            migrationBuilder.DropTable(
                name: "LeaseReturnPhotos");

            migrationBuilder.AlterColumn<int>(
                name: "OfferId",
                table: "Leases",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "FilePath",
                table: "LeaseReturns",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Leases_Offers_OfferId",
                table: "Leases",
                column: "OfferId",
                principalTable: "Offers",
                principalColumn: "OfferId");
        }
    }
}
