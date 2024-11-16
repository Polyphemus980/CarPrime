using System.ComponentModel.DataAnnotations;
namespace CarPrime.Models;

public class Company
{
    [Key]
    public int CompanyId { get; set; }
    public string Name { get; set; }
    public string ApiUrl { get; set; }
    private List<Offer> Offers { get; set; }
}