using CarPrime.Controllers;
using CarPrime.Models;
using CarPrime.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarPrime.Companies;

public class CarPrimeCompany(CarPrimeService service) : ICarCompany
{
    public int Id => 0;
    public async Task<List<FrontCar>> GetCars()
    {
        return await service.GetCars();
    }

    public async Task<ActionResult<FrontCar>> GetCar(int carId)
    {
        return await service.GetCarById(carId);
    }

    public async Task<ActionResult<Offer>> CreateOffer(int carId, Customer customer)
    {
        return await service.RequestOffer(carId, customer);
    }

    public async Task<ActionResult<Lease>> AcceptOffer(int offerId, Customer customer)
    {
        return await service.AcceptOffer(offerId, customer);
    }

    public async Task<ActionResult<Offer>> GetOffer(int offerId, Customer customer)
    {
        return await service.GetOffer(offerId, customer);
    }

    public async Task<ActionResult<Lease>> GetLease(int leaseId, Customer customer)
    {
        return await service.GetLease(leaseId, customer);
    }

    public async Task<ActionResult> EndLease(int leaseId, Customer customer)
    {
        return await service.RequestEndLease(leaseId);
    }
}