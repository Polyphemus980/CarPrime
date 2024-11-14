using System.ComponentModel.DataAnnotations;

namespace CarPrime.Models;

public class CarModel
{
    [Key] public int ModelId { get; set; }
    private List<Car> Cars { get; set; }
    public string Brand { get; set; }
    public string Name { get; set; }
}