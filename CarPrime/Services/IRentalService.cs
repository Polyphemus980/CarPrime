using CarPrime.Models;
using Microsoft.AspNetCore.Mvc;

namespace CarPrime.Services;

public interface IRentalService
{
    Task<IActionResult> GetOfferAsCustomer(int offerId, Customer customer);
    Task<Offer> CreateOffer(Car car, Customer customer, Company company);
    Task DeleteOffer(Offer offer);
    Task<Lease> AcceptOffer(Offer offer);

    Task EndLease(Lease lease);
}