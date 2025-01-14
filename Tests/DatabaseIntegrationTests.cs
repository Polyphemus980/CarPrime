using System.Data;
using System.Net.Mime;
using System.Runtime.InteropServices.JavaScript;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace Tests;
using CarPrime.Models;
using CarPrime.Data;
public class DbIntegrationTests:IClassFixture<DatabaseFixture>
{
    private readonly DatabaseFixture _fixture;
    public DbIntegrationTests(DatabaseFixture fixture)
    {
        _fixture = fixture;
    }
    
    [Fact]
    public async Task Test1_CanQueryDatabase()
    {
        await using var context = new ApplicationDbContext(_fixture.CreateNewOptions());
        await context.SeedDb();
        
        var result = context.Cars.ToList();
        
        Assert.NotNull(result);
    }
    [Fact]
    
    public async Task Test2_CanAddToDatabase()
    {
        await using var context = new ApplicationDbContext(_fixture.CreateNewOptions());
        await context.SeedDb();
        
        var exampleTime = new DateTime(2025, 1, 10);
        var emptyCar = await context.Cars.Where((c) => c.ManufactureYear == exampleTime).FirstOrDefaultAsync();
        Assert.Null(emptyCar);
        var car = new Car { ModelId = 1, ManufactureYear = exampleTime}; 
        await context.Cars.AddAsync(car);
        await context.SaveChangesAsync();
        var insertedCar = await context.Cars.Where((c) => c.ManufactureYear == exampleTime).FirstOrDefaultAsync();
        Assert.NotNull(insertedCar);
    }
    
    [Fact]
    public async Task Test3_CascadeOnDelete()
    {
        await using var context = new ApplicationDbContext(_fixture.CreateNewOptions());
        await context.SeedDb();
            
        var cars = await context.Cars.Where((c) => c.ModelId == 1).ToListAsync();
        Assert.NotNull(cars);

        var model = await context.CarModels.FindAsync(1);
        Assert.NotNull(model);

        context.CarModels.Remove(model);
        await context.SaveChangesAsync();

        var carsAfterRemoval = await context.Cars.Where((c) => c.ModelId == 1).ToListAsync();
        Assert.Empty(carsAfterRemoval);
    }
    
    
}

public class DatabaseFixture
{
    public DbContextOptions<ApplicationDbContext> CreateNewOptions()
    {
        return new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
    }
}