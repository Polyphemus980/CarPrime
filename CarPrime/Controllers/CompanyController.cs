using CarPrime.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CarPrime.Controllers;

public class CompanyController(
    CompaniesService companiesService,
    CustomerService customerService
    ) : ControllerBase
{
    
    private static readonly TimeSpan GetCarsTimeout = TimeSpan.FromSeconds(10);
    
    [HttpGet("/Company/All/Car/")]
    public async Task<IActionResult> GetCars()
    {
        var tasks = companiesService.AllCompanies.Select(company => 
            company.GetCars()
                .WaitAsync(timeout: GetCarsTimeout)
                .DefaultIfFaulted());
        var values = await Task.WhenAll(tasks);
        var cars = values.SelectMany(maybeList => maybeList ?? []).ToList();
        
        return Ok(cars);
    }

    [HttpGet("/Company/{companyId:int}/Car/{carId:int}")]
    public async Task<IActionResult> GetCar(int companyId, int carId)
    {
        var company = companiesService[companyId];
        var car = await company.GetCar(carId);
        
        return Ok(car);
    }
    
    [HttpGet("/Company/{companyId:int}/Car/{carId:int}/offer")]
    [Authorize]
    public async Task<IActionResult> RequestOffer(int companyId, int carId)
    {
        var company = companiesService[companyId];
        var customer = await customerService.GetAuthenticatedCustomerAsync(User);
        if (customer == null)
            return Challenge();
        
        var offer = await company.CreateOffer(carId, customer);
        
        return Ok(offer);
    }

    [HttpGet("/Company/{companyId:int}/Offer/{offerId:int}")]
    [Authorize]
    public async Task<IActionResult> GetOffer(int companyId, int offerId)
    {
        var company = companiesService[companyId];
        var customer = await customerService.GetAuthenticatedCustomerAsync(User);
        if (customer == null)
            return Challenge();
        
        var offer = await company.GetOffer(offerId, customer);
        
        return Ok(offer);
    }

    [HttpPost("/Company/{companyId:int}/Offer/{offerId:int}/accept")]
    [Authorize]
    public async Task<IActionResult> AcceptOffer(int companyId, int offerId)
    {
        var company = companiesService[companyId];
        var customer = await customerService.GetAuthenticatedCustomerAsync(User);
        if (customer == null)
            return Challenge();
        
        var lease = await company.AcceptOffer(offerId, customer);
        
        return Ok(lease);
    }

    [HttpGet("/Company/{companyId:int}/Lease/{leaseId:int}")]
    [Authorize]
    public async Task<ActionResult> GetLease(int companyId, int leaseId)
    {
        var company = companiesService[companyId];
        var customer = await customerService.GetAuthenticatedCustomerAsync(User);
        if (customer == null)
            return Challenge();
        
        var lease = await company.GetLease(leaseId, customer);
        
        return Ok(lease);
    }

    [HttpDelete("/Company/{companyId:int}/Lease/{leaseId:int}")]
    [Authorize]
    public async Task<IActionResult> RequestEndLease(int companyId, int leaseId)
    {
        var company = companiesService[companyId];
        var customer = await customerService.GetAuthenticatedCustomerAsync(User);
        if (customer == null)
            return Challenge();
        
        await company.EndLease(leaseId, customer);

        return Ok();
    }
}

public static class TaskExtensions
{
    public static Task<T?> DefaultIfFaulted<T>(this Task<T> @this)
    {
        return @this.ContinueWith(task => task.IsCanceled || task.IsFaulted ? default : task.Result);
    }
}