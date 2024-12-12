namespace CarPrime.Models;

public class LeaseReturnPhoto
{
    public int Id { get; set; }
    public int LeaseReturnId { get; set; }
    public string ImageUrl { get; set; }
    
    public LeaseReturn LeaseReturn { get; set; }
}