using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarPrime.Migrations
{
    /// <inheritdoc />
    public partial class AddRentPrizeToOffer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "RentPrize",
                table: "Offers",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RentPrize",
                table: "Offers");
        }
    }
}
