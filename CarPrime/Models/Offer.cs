using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarPrime.Models;

public class Offer
{
    [Key] public int OfferId { get; set; }
    public int CustomerId { get; set; }
    [Required]
    public Customer Customer { get; set; }
    public int CarId { get; set; }
    [Required]
    public Car Car { get; set; }
    public int CompanyId { get; set; }
    [Required]
    public Company Company { get; set; }
    
    [Required] [Column(TypeName="money")]
    public decimal InsurancePrize { get; set; }
    [Required]
    public decimal RentPrize { get; set; }
    [Required]
    public DateTime CreatedAt { get; set; }
    public bool IsDeleted { get; set; }
}