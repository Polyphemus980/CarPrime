using CarPrime.Controllers;
using CarPrime.Data;
using CarPrime.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarPrime.Services;

public class CarPrimeService(
    ApplicationDbContext context,
    IEmailService emailService,
    IRentalService rentalService,
    ILogger<CarPrimeService> logger)
{

    public async Task<Company> GetCompany()
    {
        const string companyName = "CarPrime";
        var company = await context.Companies.FirstOrDefaultAsync(company => company.Name == companyName); 
        if (company == null)
        {
            company = new Company
            {
                Name = "Default Company",
                ApiUrl = "localhost:2137",
            };
            await context.Companies.AddAsync(company);
        }
        return company;
    }

    public async Task<List<FrontCar>> GetCars()
    {
        logger.LogInformation("Get action called.");
        return await context.Cars
            .GroupJoin(context.Leases, car => car.CarId, lease => lease.Offer.CarId, (car, leases) => new { car, leases })
            // dostępne są te samochody, dla których nie ma aktywnych wypożyczeń
            .Select(arg => new { arg.car, status = arg.leases.All(lease => lease.Status == LeaseStatus.Finished) ? CarStatus.Available : CarStatus.NotAvailable })
            .Select(arg => new FrontCar(arg.car.CarId, arg.car.Model.Brand, arg.car.Model.Name, arg.car.ManufactureYear.Year, arg.status))
            .ToListAsync();
    }

    public async Task<ActionResult<FrontCar>> GetCarById(int carId)
    {
        logger.LogInformation("Get action called with id {id}.", carId);
        var car = await context.Cars
            .Where(car => car.CarId == carId)
            .GroupJoin(context.Leases, car => car.CarId, lease => lease.Offer.CarId, (car, leases) => new { car, leases })
            .Select(arg => new { arg.car, status = arg.leases.All(lease => lease.Status == LeaseStatus.Finished) ? CarStatus.Available : CarStatus.NotAvailable })
            .Select(arg => new FrontCar(arg.car.CarId, arg.car.Model.Brand, arg.car.Model.Name, arg.car.ManufactureYear.Year, arg.status))
            .SingleOrDefaultAsync();
        return car == null ? new NotFoundResult() : car;
    }

    public async Task<ActionResult<Offer>> RequestOffer(int carId, Customer customer)
    {
        var car = await context.Cars.FindAsync(carId);
        if (car == null)
            return new NotFoundObjectResult("Car not found");
        var carModel = await context.CarModels.FindAsync(car.ModelId);
        if (carModel == null) 
            throw new Exception("Invalid car in DB. Car model not found");
        
        var company = await GetCompany();
        
        var offer = await rentalService.CreateOffer(car, customer, company);
        logger.LogInformation("New offer created: {offer}", offer);
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
        await emailService.SendEmailAsync(customer.Email, subject, message);
        logger.LogInformation("email sent to {customer.Email}", customer.Email);

        return offer;
    }

    public async Task<ActionResult<Offer>> GetOffer(int offerId, Customer customer)
    {
        return await rentalService.GetOfferAsCustomer(offerId, customer);
    }
    public async Task<ActionResult<Lease>> AcceptOffer(int offerId, Customer customer)
    {
        var result = await rentalService.GetOfferAsCustomer(offerId, customer);
        return await result.Map(rentalService.AcceptOffer);
    }

    public async Task<ActionResult<Lease>> GetLease(int leaseId, Customer customer)
    {
        var lease = await context.Leases.FindAsync(leaseId);
        if (lease == null)
            return new NotFoundResult();
        if (lease.LeaserId != customer.CustomerId)
            return new UnauthorizedResult();
        return lease;
    }

    public async Task<ActionResult> RequestEndLease(int leaseId)
    {
        var lease = await context.Leases.Where(lease => lease.LeaseId == leaseId).FirstOrDefaultAsync();
        if (lease == null)
        {
            return new NotFoundObjectResult($"No lease with id {leaseId} exists");
        }

        lease.Status = LeaseStatus.WaitingForEmployeeApproval;
        await context.SaveChangesAsync();
        return new OkObjectResult("End lease process started");
    }
    
}