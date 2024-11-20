using System.ComponentModel.DataAnnotations;

namespace CarPrime.Models;

public class Customer
{
    [Required] public DateTime Birthdate { get; set; }
    [Key] public int CustomerId { get; set; }

    [EmailAddress] [Required] public string Email { get; set; }

    [Required] public string FirstName { get; set; }

    [Required] public string LastName { get; set; }

    [Required] public DateTime LicenceIssuedDate { get; set; }

    [Required] public string Country { get; set; }

    [Required] public string City { get; set; }

    [Required] public string Address { get; set; }

    [Required] public DateTime CreatedAt { get; set; }
    
    public List<Lease> Leases { get; set; }
    public List<Offer> Offers { get; set; }
}