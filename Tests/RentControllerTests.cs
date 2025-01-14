using System.Linq.Expressions;
using CarPrime.Controllers;
using CarPrime.Data;
using CarPrime.Models;
using CarPrime.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;

namespace Tests;

public class RentControllerTests
{
    private readonly Mock<IRentalService> _mockRentalService;
    private readonly Mock<ICustomerService> _mockCustomerService;
    private readonly Mock<ILogger<RentController>> _mockLogger;
    private readonly Mock<IBlobService> _mockBlobService;
    private readonly ApplicationDbContext _context;
    private readonly RentController _controller;

    public RentControllerTests()
    {
        var databaseName = Guid.NewGuid().ToString();
        
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: databaseName)
            .Options;
        
        _context = new ApplicationDbContext(options);
        
        _context = new ApplicationDbContext(options);
        
        _mockRentalService = new Mock<IRentalService>();
        _mockCustomerService = new Mock<ICustomerService>();
        _mockLogger = new Mock<ILogger<RentController>>();
        _mockBlobService = new Mock<IBlobService>();
        
        _controller = new RentController(
            _context,
            _mockRentalService.Object,
            _mockCustomerService.Object,
            _mockLogger.Object,
            _mockBlobService.Object
        );
    }

    [Fact]
    public async Task RequestEndLease_WithValidId_ReturnsOkResult()
    {
        var lease = new Lease
        {
            LeaseId = 1,
            Status = LeaseStatus.Open
        };
        _context.Leases.Add(lease);
        await _context.SaveChangesAsync();
        
        var result = await _controller.RequestEndLease(1);
        
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("End lease process started", okResult.Value);
        
        var updatedLease = await _context.Leases.FindAsync(1);
        Assert.Equal(LeaseStatus.WaitingForEmployeeApproval, updatedLease!.Status);
    }

    [Fact]
    public async Task RequestEndLease_WithInvalidId_ReturnsNotFound()
    {
        const int nonExistentLeaseId = 999;
        
        var result = await _controller.RequestEndLease(nonExistentLeaseId);
        
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal($"No lease with id {nonExistentLeaseId} exists", notFoundResult.Value);
    }
    [Fact]
    public async Task AcceptLeaseReview_WithValidData_ReturnsOkResult()
    {
        const int leaseId = 1;
        var testDate = DateTime.Now;
        
        var lease = new Lease
        {
            LeaseId = leaseId,
            Status = LeaseStatus.WaitingForEmployeeApproval
        };
        _context.Leases.Add(lease);
        await _context.SaveChangesAsync();
        
        var returnData = new ReturnData(Description: "Test return description", Images:
        [
            CreateMockFormFile("test1.jpg"),
            CreateMockFormFile("test2.jpg")
        ]);
        
        var expectedImagePaths = new List<string> 
        { 
            "uploads/1/image1.jpg", 
            "uploads/1/image2.jpg" 
        };
        _mockBlobService
            .Setup(x => x.SavePhotos(It.IsAny<List<IFormFile>>(), leaseId))
            .ReturnsAsync(expectedImagePaths);
        
        var result = await _controller.AcceptLeaseReview(returnData, leaseId);
        
        Assert.IsType<OkResult>(result);
        
        var updatedLease = await _context.Leases.FindAsync(leaseId);
        Assert.Equal(LeaseStatus.Finished, updatedLease!.Status);
        Assert.NotNull(updatedLease.EndedAt);
        
        var leaseReturn = await _context.LeaseReturns
            .Include(lr => lr.Photos)
            .FirstOrDefaultAsync(lr => lr.LeaseId == leaseId);
        Assert.NotNull(leaseReturn);
        Assert.Equal(returnData.Description, leaseReturn.Description);
        Assert.Equal(2, leaseReturn.Photos.Count);
        
        _mockBlobService.Verify(
            x => x.SavePhotos(It.IsAny<List<IFormFile>>(), leaseId),
            Times.Once);
    }

     



    private IFormFile CreateMockFormFile(string fileName)
    {
        var fileMock = new Mock<IFormFile>();
        fileMock.Setup(f => f.FileName).Returns(fileName);
        fileMock.Setup(f => f.Length).Returns(1024);
        fileMock.Setup(f => f.OpenReadStream()).Returns(new MemoryStream());
        return fileMock.Object;
    }
}