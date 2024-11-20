using CarPrime.Models;
namespace CarPrime.Services;

public interface ICustomerService
{
    public Task<Customer?> GetCustomerByEmailAsync(string email);
    public Task AddCustomerAsync(Customer customer);
}