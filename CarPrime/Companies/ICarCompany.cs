using CarPrime.Controllers;
using CarPrime.Models;
using Microsoft.AspNetCore.Mvc;

namespace CarPrime.Companies;

public interface ICarCompany
{
    public int Id { get; }
    
    public Task<List<FrontCar>> GetCars();
    public Task<ActionResult<FrontCar>> GetCar(int carId);
    public Task<ActionResult<Offer>> CreateOffer(int carId, Customer customer);
    public Task<ActionResult<Lease>> AcceptOffer(int offerId, Customer customer);
    public Task<ActionResult<Offer>> GetOffer(int offerId, Customer customer);
    public Task<ActionResult<Lease>> GetLease(int leaseId, Customer customer);
    public Task<ActionResult> EndLease(int leaseId, Customer customer);
}