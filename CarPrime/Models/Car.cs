using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarPrime.Models;

public class Car
{
    [Key] public int CarId { get; set; }
    public int ModelId { get; set; }
    [ForeignKey("ModelId")]
    [Required] public CarModel Model { get; set; }
    [Required] public DateTime ManufactureYear { get; set; }
    public Offer? Offer { get; set; }

    public String? ImageUrl { get; set; }
}