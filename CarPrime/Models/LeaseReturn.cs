using System.ComponentModel.DataAnnotations;
namespace CarPrime.Models;

public class LeaseReturn
{
    [Key] public int LeaseId { get; set; }
    public int EmployeeId { get; set; }
    [Required]
    public Employee Employee { get; set; }
    [Required]
    public string Description { get; set; }
    [Required]
    public string FilePath { get; set; }
}