using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;
using CarPrime.Services;
using Microsoft.AspNetCore.Authorization;
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
    private readonly ICustomerService _customerService;
    private readonly IRentalService _rentalService;
    private readonly CarPrimeService _carPrimeService;

    public CarController(ApplicationDbContext context, ILogger<CarController> logger, IEmailService emailService, ICustomerService customerService,IRentalService rentalService, CarPrimeService carPrimeService)
    {
        _context = context;
        _logger = logger;
        _emailService = emailService;
        _customerService = customerService;
        _rentalService = rentalService;
        _carPrimeService = carPrimeService;
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
    public async Task<IActionResult> GetCars()
    {
        var frontCars = await _carPrimeService.GetCars();
        return Ok(frontCars);
    }
    
    
    [HttpPost("/Car/{id:Int}/rent")]
    [Authorize]
    public async Task<IActionResult> RentCar([FromRoute] int id)
    {
        var customer = await _customerService.GetAuthenticatedCustomerAsync(User);
        if (customer == null) 
            return Challenge();
        var car = await _context.Cars.FindAsync(id);
        if (car == null)
            return NotFound("Car not found");
        _logger.LogInformation("Customer {customer} wants to rent car wth id {id}", customer, id);
        
        // company chyba też będzie musiało być przekazywane w requeście; lub jakiś sposób identyfikacji z id
        var company = await _carPrimeService.GetCompany();

        var offer = _context.Offers.FirstOrDefault(offer => offer.CarId == car.CarId);
        if (offer != null)
        {
            return Conflict($"Car with id {car.CarId} already has an offer."); 
        }
        offer = await _rentalService.CreateOffer(car, customer, company);
        _logger.LogInformation("New offer created: {offer}", offer);

        var lease = new Lease
        {
            Offer = offer,
            Leaser = customer,
            CreatedAt = DateTime.Now,
        };
        await _context.Leases.AddAsync(lease);
        
        await _context.SaveChangesAsync();
        
        return Ok("Car rented successfully."); 
    }

   
    [HttpGet("/Car/{id:int}/offer")]
    [Authorize]
    public async Task<IActionResult> RequestOffer([FromRoute] int id)
    {

        var customer = await _customerService.GetAuthenticatedCustomerAsync(User);
        if (customer == null)
            return Challenge();

        var offerResult = await _carPrimeService.RequestOffer(id, customer);
        return offerResult switch
        {
            { Value: { } offer } => Ok(offer.OfferId),
            { Result: { } result } => result,
            _ => throw new Exception()
        };
    }

    [HttpGet("/Car/{id:int}")]
    public async Task<IActionResult> GetCarById([FromRoute] int id)
    {
        var carResult = await _carPrimeService.GetCarById(id);
        return carResult switch
        {
            { Value: { } car } => Ok(car),
            { Result: { } result } => result,
            _ => throw new Exception()
        };
    }

    [HttpGet("/Car/rented")]
    [Authorize]
    public async Task<IActionResult> GetRentedCarsByCustomerId()
    {
        var customer = await _customerService.GetAuthenticatedCustomerAsync(User);
        if (customer == null)
            return Challenge();
        var cars = await _context.Leases
            .Where(lease => lease.Offer.CustomerId == customer.CustomerId)
            .Select(lease => new { car = lease.Offer.Car, lease })
            .Select(arg => 
                new RentedCar(arg.car.CarId, arg.car.Model.Brand, arg.car.Model.Name, arg.car.ManufactureYear.Year, 
                    /*status:*/ arg.lease.EndedAt != null ? RentedStatus.RentEnded : RentedStatus.CurrentlyRented,
                    arg.lease.LeaseId)
            )
            .ToListAsync();
        
        return Ok(cars);
    }
    
}


[SuppressMessage("ReSharper", "NotAccessedPositionalProperty.Global")]
public record FrontCar(int Id, string Brand, string Name, int Year, CarStatus Status);
    
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum CarStatus
{
    /// <summary>
    /// Not rented by anyone, can be rented
    /// </summary>
    [JsonStringEnumMemberName("available")]
    Available,
    /// <summary>
    /// Currently rented by someone, cannot be rented
    /// </summary>
    [JsonStringEnumMemberName("not available")]
    NotAvailable,
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum RentedStatus
{
    
    /// <summary>
    /// Currently rented by this customer
    /// </summary>
    CurrentlyRented,
    /// <summary>
    /// Car was rented by this customer at some point
    /// </summary>
    RentEnded
}

[SuppressMessage("ReSharper", "NotAccessedPositionalProperty.Global")]
public record RentedCar(int Id, string Brand, string Name, int Year, RentedStatus Status, int LeaseId);