using System.Diagnostics.CodeAnalysis;
using CarPrime.Data;
using CarPrime.Models;
using CarPrime.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CarPrime.Controllers;

[Authorize]
public class RentController(
    ApplicationDbContext context,
    IRentalService rentalService,
    ICustomerService customerService,
    ILogger<RentController> logger
) : ControllerBase
{
    
    [HttpGet("/Offer/{id:int}")]
    public async Task<IActionResult> GetOffer([FromRoute] int id)
    {
        var customer = await customerService.GetAuthenticatedCustomerAsync(User);
        if (customer == null)
            return Unauthorized();
        var result = await rentalService.GetOfferAsCustomer(id, customer);
        if (result is not OkObjectResult { Value: Offer offer }) 
            return result;
        
        return Ok(OfferDisplay.FromOffer(offer));
    }

    [HttpPost("/Offer/{id:int}/accept")]
    public async Task<IActionResult> AcceptOffer([FromRoute] int id)
    {
        var customer = await customerService.GetAuthenticatedCustomerAsync(User);
        if (customer == null)
            return Unauthorized();
        var result = await rentalService.GetOfferAsCustomer(id, customer);
        if (result is not OkObjectResult { Value: Offer offer })
            return result;
        
        var lease = await rentalService.AcceptOffer(offer);
        
        return Ok(lease.LeaseId);
    }

    [HttpGet("/Lease/{id:int}")]
    public async Task<IActionResult> GetLease([FromRoute] int id)
    {
        var customer = await customerService.GetAuthenticatedCustomerAsync(User);
        if (customer == null)
            return Unauthorized();
        var lease = await context.Leases.FindAsync(id);
        if (lease == null)
            return NotFound();
        if (lease.LeaserId != customer.CustomerId)
            return Unauthorized();
        return Ok(LeaseDisplay.FromLease(lease));
    }
}

[SuppressMessage("ReSharper", "NotAccessedPositionalProperty.Global")]
public record OfferDisplay(int OfferId, int CarId, int CompanyId, decimal InsurancePrize, decimal RentPrize, DateTime CreatedAt) 
{
    public static OfferDisplay FromOffer(Offer offer) => 
        new(offer.OfferId, offer.CarId, offer.CompanyId, offer.InsurancePrize, offer.RentPrize, offer.CreatedAt);
}

[SuppressMessage("ReSharper", "NotAccessedPositionalProperty.Global")]
public record LeaseDisplay(int LeaseId, int? OfferId, DateTime CreatedAt, DateTime? EndedAt)
{
    //TODO czemu Lease.OfferId jest nullable?
    public static LeaseDisplay FromLease(Lease lease) =>
        new(lease.LeaseId, lease.OfferId, lease.CreatedAt, lease.EndedAt);
}