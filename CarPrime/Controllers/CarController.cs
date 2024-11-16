using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarPrime.Controllers;
using Data;
using Models;

[ApiController]
[Route("[controller]")]
public class CarController : Controller
{
    private readonly ILogger<CarController> _logger;
    private readonly ApplicationDbContext _context;

    public CarController(ApplicationDbContext context,ILogger<CarController> logger)
    {
        _context = context;
        _logger = logger;
    }
    
    [HttpPost]
    public async Task<IActionResult> InsertCarModel()
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

    [HttpGet]
    public async Task<IActionResult> GetModels()
    {
        _logger.LogInformation("Get action called.");
        var carModels = await _context.CarModels.ToListAsync();
        _logger.LogInformation("Cars got action called.");
        return Ok(carModels);
    }
}