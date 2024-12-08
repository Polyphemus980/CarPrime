using System.Security.Claims;
using CarPrime.Data;
using CarPrime.Models;
using Microsoft.EntityFrameworkCore;

namespace CarPrime.Services;

public class CustomerService : ICustomerService
{
    private readonly ApplicationDbContext _dbContext;

    public CustomerService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task<Customer?> GetCustomerByEmailAsync(string email)
    {
        Customer? customer = await _dbContext.Customers.FirstOrDefaultAsync(customer => customer.Email == email);
        return customer;
    }

    public async Task AddCustomerAsync(Customer customer)
    {
        await _dbContext.Customers.AddAsync(customer);
        await _dbContext.SaveChangesAsync();
    }
    
    public async Task<Customer?> GetAuthenticatedCustomerAsync(ClaimsPrincipal currentUser)
    {
        if (currentUser.Identity?.IsAuthenticated != true)
            return null;
        var email = currentUser.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        return await GetCustomerByEmailAsync(email);
    }
}