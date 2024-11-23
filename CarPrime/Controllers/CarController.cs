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
    private readonly ICustomerService _customerService;
    private readonly IRentalService _rentalService;

    public CarController(ApplicationDbContext context, ILogger<CarController> logger, IEmailService emailService, ICustomerService customerService, IRentalService rentalService)
    {
        _context = context;
        _logger = logger;
        _emailService = emailService;
        _customerService = customerService;
        _rentalService = rentalService;
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
        _logger.LogInformation("Get action called.");
        var frontCars = await _context.Cars
            .GroupJoin(_context.Leases, car => car.CarId, lease => lease.Offer.CarId, (car, leases) => new { car, leases })
            // dostępne są te samochody, dla których nie ma aktywnych wypożyczeń
            .Select(arg => new { arg.car, status = arg.leases.All(lease => lease.EndedAt != null) ? "available" : "not available" })
            .Select(arg => new FrontCar(arg.car.CarId, arg.car.Model.Brand, arg.car.Model.Name, arg.car.ManufactureYear.Year, arg.status))
            .ToListAsync();
        _logger.LogInformation("Cars got action called.");
        return Ok(frontCars);
    }
    
    public record FrontCar(int Id, string Brand, string Name, int Year, string Status);
    
    [HttpPost("/Car/{id:Int}/rent")]
    public async Task<IActionResult> RentCar([FromRoute] int id, [FromBody] CustomerData customerData)
    {
        _logger.LogInformation("Customer {customer} wants to rent car wth id {id}", customerData, id);
        var car = await _context.Cars.FindAsync(id);
        if (car == null)
            return NotFound("Car not found");
        
        var customer = await _customerService.GetCustomerByEmailAsync(customerData.Email);
        if (customer == null)
        {
            customer = new Customer
            {
                FirstName = customerData.FirstName,
                LastName = customerData.LastName,
                Email = customerData.Email,
                CreatedAt = DateTime.Now,
                Country = "Unknown",
                City = "Unknown",
                Address = "Unknown",
            };
            await _customerService.AddCustomerAsync(customer);
        }
        // company chyba też będzie musiało być przekazywane w requeście; lub jakiś sposób identyfikacji z id
        var company = await _context.Companies.FirstOrDefaultAsync(); 
        if (company == null)
        {
            company = new Company
            {
                Name = "Default Company",
                ApiUrl = "localhost:2137",
            };
            await _context.Companies.AddAsync(company);
        }

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

    [HttpGet("/Car/rented/customer={customerId:int}")]
    public async Task<IActionResult> GetRentedCarsByCustomerId([FromRoute] int customerId)
    {
        if (await _context.Customers.FindAsync(customerId) == null)
            return NotFound($"Customer with id {customerId} not found");
        var cars = await _context.Leases
            .Where(lease => lease.Offer.CustomerId == customerId)
            .Select(lease => new { car = lease.Offer.Car, status = lease.EndedAt != null ? CarStatus.RentEnded : CarStatus.CurrentlyRented })
            .Select(arg => new FrontCar(arg.car.CarId, arg.car.Model.Brand, arg.car.Model.Name, arg.car.ManufactureYear.Year, arg.status))
            .ToListAsync();
        
        return Ok(cars);
    }
    
}