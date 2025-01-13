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

    public CarController(ApplicationDbContext context, ILogger<CarController> logger, IEmailService emailService, ICustomerService customerService,IRentalService rentalService)
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
            .Select(arg => new { arg.car, status = arg.leases.All(lease => lease.Status == LeaseStatus.Finished) ? CarStatus.Available : CarStatus.NotAvailable })
            .Select(arg => new FrontCar(arg.car.CarId, arg.car.Model.Brand, arg.car.Model.Name, arg.car.ManufactureYear.Year, arg.status))
            .ToListAsync();
        _logger.LogInformation("Cars got action called.");
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
        var company = await DefaultCompany();

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

    //tymczasowo, dopóki nie mamy Company
    private async Task<Company> DefaultCompany()
    {
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
        return company;
    }
   
    [HttpGet("/Car/{id:int}/offer")]
    [Authorize]
    public async Task<IActionResult> RequestOffer([FromRoute] int id)
    {

        var car = await _context.Cars.FindAsync(id);

        if (car == null)

            return NotFound("Car not found");

        var carModel = await _context.CarModels.FindAsync(car.ModelId);

        if (carModel == null) 

            throw new Exception("Invalid car in DB. Car model not found");

        var customer = await _customerService.GetAuthenticatedCustomerAsync(User);

        if (customer == null)

            return Challenge();

        var company = await DefaultCompany();

        

        var offer = await _rentalService.CreateOffer(car, customer, company);

        _logger.LogInformation("New offer created: {offer}", offer);

        var message = $"""

                       Hello {customer.FirstName} {customer.LastName},

                       

                       

                       Here are the details for the offer you requested:

                       

                       Customer Data:

                           First Name:         {customer.FirstName}

                           Last Name:          {customer.LastName}

                           Email:              {customer.Email}

                           Birth Date:         {customer.Birthdate:d}

                           License Issue Date: {customer.LicenceIssuedDate:d}

                           Country:            {customer.Country}

                           City:               {customer.City}

                           Address:            {customer.Address}

                       Car Data:

                           Brand:              {carModel.Brand}

                           Model:              {carModel.Name}

                           Manufacture Year:   {car.ManufactureYear.Year}

                           Details:            {"" /*TODO*/}

                           

                       Offer Details:

                           Insurance Price:    {offer.InsurancePrize}

                           Rent Price:         {offer.RentPrize}

                           Expiration Date:    {(offer.CreatedAt + RentalService.OfferExpirationTime):g}

                        

                           

                       To accept or decline the offer, visit {"<TODO>" /*TODO link do strony*/}

                       

                       Sincerely,

                       CarPrime Team

                       """;

        var subject = $"Offer for {carModel.Brand} {carModel.Name} ({car.ManufactureYear.Year})";

        await _emailService.SendEmailAsync(customer.Email, subject, message);

        _logger.LogInformation("email sent to {customer.Email}", customer.Email);

        return Ok(offer.OfferId);

    }

    [HttpGet("/Car/{id:int}")]
    public async Task<IActionResult> GetCarById([FromRoute] int id)
    {
        _logger.LogInformation("Get action called with id {id}.", id);
        var car = await _context.Cars.FindAsync(id);
        if (car == null)
            return NotFound();
        return Ok(car);
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