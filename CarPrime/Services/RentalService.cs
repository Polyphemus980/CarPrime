﻿using CarPrime.Data;
using CarPrime.Models;

namespace CarPrime.Services;

public class RentalService(ApplicationDbContext context) : IRentalService
{
    public async Task<Offer> CreateOffer(Car car, Customer customer, Company company)
    {
        var offer = new Offer
        {
            Customer = customer,
            Car = car,
            Company = company,
            CreatedAt = DateTime.Now,
        };
        await context.Offers.AddAsync(offer);
        return offer;
    }

    public async Task DeleteOffer(Offer offer)
    {
        if (!offer.IsDeleted)
        {
            offer.IsDeleted = true;
            await context.SaveChangesAsync();
        }
    }

    public async Task<Lease> AcceptOffer(Offer offer)
    {
        if (IsExpired(offer))
            throw new Exception("Offer is expired");
        var lease = new Lease
        {
            Offer = offer,
            Leaser = offer.Customer,
            CreatedAt = DateTime.Now,
        };
        await context.Leases.AddAsync(lease);
        
        return lease;
    }

    public async Task EndLease(Lease lease)
    {
        lease.EndedAt = DateTime.Now;
        lease.Offer.IsDeleted = true;
        await context.SaveChangesAsync();
    }
    
    public static readonly TimeSpan OfferExpirationTime = TimeSpan.FromMinutes(10);
    
    public static bool IsExpired(Offer offer) => offer.IsDeleted || DateTime.Now - offer.CreatedAt > OfferExpirationTime; 
}