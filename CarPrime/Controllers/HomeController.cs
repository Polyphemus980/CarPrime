using CarPrime.Services;
using Microsoft.AspNetCore.Mvc;
namespace CarPrime.Controllers;
using Data;

[ApiController]
[Route("")]
public class HomeController : Controller
{
    private readonly ApplicationDbContext _context;
    public HomeController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public IActionResult Index()
    {
        return Ok("Hello world");
    }
}