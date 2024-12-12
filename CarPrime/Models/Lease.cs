using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarPrime.Models;

public enum LeaseStatus
{
    Open,
    WaitingForEmployeeApproval,
    Finished
}
public class Lease
{
    [Key]
    public int LeaseId { get; set; }
    
    public int OfferId { get; set; }
    public Offer Offer { get; set; }
    public int LeaserId { get; set; }
    
    [ForeignKey("LeaserId")]
    public Customer Leaser { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public LeaseStatus Status { get; set; }
}