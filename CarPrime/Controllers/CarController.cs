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

    public CarController(ApplicationDbContext context, ILogger<CarController> logger, IEmailService emailService)
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

        return Ok("Car model inserted successfully");
    }

    [HttpGet]
    public async Task<IActionResult> GetModels()
    {
        _logger.LogInformation("Get action called.");
        var carModels = await _context.CarModels.ToListAsync();
        _logger.LogInformation("Cars got action called.");
        return Ok(carModels);
    }

    [HttpPost("/Car/{id:Int}/rent")]
    public async Task<IActionResult> RentCar([FromRoute] int id, [FromBody] CustomerData customerData)
    {
        _logger.LogInformation("Customer {customer} wants to rent car wth id {id}", customerData, id);
        var car = await _context.CarModels.FindAsync(id);
        if (car == null)
            return NotFound();

        //TODO
        return Ok("Car rented successfully"); 
    }
    
    public record CustomerData(string FirstName, string LastName, string Email);

    [HttpGet]
    [Route("/Car/{id:int}")]
    public async Task<IActionResult> GetModelById([FromRoute] int id)
    {
        _logger.LogInformation("Get action called with id {id}.", id);
        var carModel = await _context.CarModels.FindAsync(id);
        if (carModel == null)
            return NotFound();
        return Ok(carModel);
    }

    
    
    
    private async Task<IActionResult> CreateOffer(Car car, Customer customer, Company company)
    {
        var offer = new Offer
        {
            Customer = customer,
            Car = car,
            Company = company
        };
        _context.Offers.Add(offer);
        await _context.SaveChangesAsync();
        return Ok(offer);
    }
}