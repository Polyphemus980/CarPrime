using Microsoft.EntityFrameworkCore;
using CarPrime.Models;
namespace CarPrime.Data;

public class ApplicationDbContext: DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options):base(options)
    {
    }
    
    public DbSet<Car> Cars { get; set; }
    public DbSet<CarModel> CarModels { get; set; }
    public DbSet<Company> Companies { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Lease> Leases { get; set; }
    public DbSet<LeaseReturn> LeaseReturns { get; set; }
    public DbSet<Offer> Offers { get; set; }
    public DbSet<LeaseReturnPhoto> LeaseReturnPhotos { get; set; }
}