using System.Diagnostics.CodeAnalysis;
using CarPrime.Data;
using CarPrime.Models;
using CarPrime.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarPrime.Controllers;

[Authorize]
public class RentController(
    ApplicationDbContext context,
    IRentalService rentalService,
    ICustomerService customerService,
    ILogger<RentController> logger,
    IBlobService blobService
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

    [HttpDelete("/Lease/{id:Int}")]
    public async Task<IActionResult> RequestEndLease([FromRoute] int leaseId)
    {
        var lease = await context.Leases.Where(lease => lease.LeaseId == leaseId).FirstOrDefaultAsync();
        if (lease == null)
        {
            return NotFound($"No lease with id {leaseId} exists");
        }

        lease.Status = LeaseStatus.WaitingForEmployeeApproval;
        return Ok("End lease process started");
    }
    
    [HttpPost("/Lease/{id:int}/review")]
    public async Task<IActionResult> AcceptLeaseReview([FromForm] ReturnData data,[FromRoute] int id) 
    {
        var  lease = await context.Leases.Where(lease => lease.LeaseId == id).FirstOrDefaultAsync();
        if (lease == null)
        {
            return NotFound($"No lease with id {id} exists");
        }

        lease.Status = LeaseStatus.Finished;
        lease.EndedAt = DateTime.Now;
        var leaseReturn = new LeaseReturn
        {
            LeaseId = lease.LeaseId,
            Description = data.Description,
            Photos = new List<LeaseReturnPhoto>() 
        };
        List<string> imagePaths = await blobService.SavePhotos(data.Images, id);
        foreach (var imagePath in imagePaths)
        {
            var leaseReturnPhoto = new LeaseReturnPhoto
            {
                LeaseReturn = leaseReturn,
                ImageUrl= imagePath 
            };

            leaseReturn.Photos.Add(leaseReturnPhoto); 
        }
        context.LeaseReturns.Add(leaseReturn);
        await context.SaveChangesAsync();
        return Ok();
    }
}

[SuppressMessage("ReSharper", "NotAccessedPositionalProperty.Global")]
public record OfferDisplay(int OfferId, int CarId, int CompanyId, decimal InsurancePrize, decimal RentPrize, DateTime CreatedAt) 
{
    public static OfferDisplay FromOffer(Offer offer) => 
        new(offer.OfferId, offer.CarId, offer.CompanyId, offer.InsurancePrize, offer.RentPrize, offer.CreatedAt);
}
public record ReturnData(List<IFormFile> Images,string Description);
[SuppressMessage("ReSharper", "NotAccessedPositionalProperty.Global")]
public record LeaseDisplay(int LeaseId, int? OfferId, DateTime CreatedAt, DateTime? EndedAt,String Status)
{
    //TODO czemu Lease.OfferId jest nullable?
    public static LeaseDisplay FromLease(Lease lease) =>
        new(lease.LeaseId, lease.OfferId, lease.CreatedAt, lease.EndedAt,lease.Status.ToString());
}