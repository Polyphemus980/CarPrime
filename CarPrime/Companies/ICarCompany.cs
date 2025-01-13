using CarPrime.Controllers;
using CarPrime.Models;

namespace CarPrime.Companies;

public interface ICarCompany
{
    public int Id { get; }
    
    public Task<List<FrontCar>> GetCars();
    public Task<FrontCar> GetCar(int carId);
    public Task<Offer> CreateOffer(int carId, Customer customer);
    public Task<Lease> AcceptOffer(int offerId, Customer customer);
    public Task<Offer> GetOffer(int offerId, Customer customer);
    public Task<Lease> GetLease(int leaseId, Customer customer);
    public Task EndLease(int leaseId, Customer customer);
}