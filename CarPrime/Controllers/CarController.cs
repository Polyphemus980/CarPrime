using Microsoft.AspNetCore.Mvc;
namespace CarPrime.Controllers;
using Data;
using Models;

[ApiController]
[Route("[controller]")]
public class CarController : Controller
{
    private readonly ApplicationDbContext _context;

    public CarController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    [HttpPost]
    public async Task<IActionResult> InsertCar()
    {
        CarModel model = new CarModel
        {
            Brand = "Toyota",
            Name = "Verso"
        };

        // Add the product to the database
        _context.CarModels.Add(model);
        await _context.SaveChangesAsync();

        return Ok("Car model inserted succesfully");
    }
}