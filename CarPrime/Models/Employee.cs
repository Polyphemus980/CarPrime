using System.ComponentModel.DataAnnotations;

namespace CarPrime.Models;

public class Employee
{
    [Key] public int EmployeeId { get; set; }

    [EmailAddress] [Required] public string Email { get; set; }

    [Required] public string FirstName { get; set; }
    [Required] public string LastName { get; set; }
    
    public List<LeaseReturn> LeaseReturns { get; set; }
    
}