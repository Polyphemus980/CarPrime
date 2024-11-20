using CarPrime.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarPrime.Controllers;
using Data;
using Models;

[ApiController]
[Route("[controller]")]
public class CarController : ControllerBase
{
    private readonly ILogger<CarController> _logger;
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;

    public CarController(ApplicationDbContext context,ILogger<CarController> logger,IEmailService emailService)
    {
        _context = context;
        _logger = logger;
        _emailService = emailService;
    }
    
    [HttpPost]
    public async Task<IActionResult> InsertCarModel()
    {
        CarModel model = new CarModel
        {
            Brand = "Toyota",
            Name = "Verso"
        };
        
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