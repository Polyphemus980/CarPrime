using System.ComponentModel.DataAnnotations;
namespace CarPrime.Models;

public class LeaseReturn
{
    [Key] public int LeaseId { get; set; }
    public int EmployeeId { get; set; }
    public Employee Employee { get; set; }
    [Required]
    public string Description { get; set; }

    public List<LeaseReturnPhoto> Photos { get; set; }
}