using CarPrime.Models;

namespace CarPrime.Services;

public interface IRentalService
{
    Task<Offer> CreateOffer(Car car, Customer customer, Company company);
    Task DeleteOffer(Offer offer);
    Task<Lease> AcceptOffer(Offer offer);

    Task EndLease(Lease lease);
}