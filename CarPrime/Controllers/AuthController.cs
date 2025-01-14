using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Google.Apis.Auth;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;
using System.ComponentModel.DataAnnotations;
using CarPrime.Models;
using CarPrime.Services;
using Microsoft.AspNetCore.Http.HttpResults;

namespace CarPrime.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ICustomerService _customerService;
    private readonly IConfiguration _configuration;
        
        public AuthController(IConfiguration configuration,ICustomerService customerService)
        {
            _configuration = configuration;
            _customerService = customerService;
        }    
    [HttpPost("authenticate")]
    public async Task<IActionResult> Authenticate([FromBody] GoogleAuthRequest request)
    {
        try
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken,
                new GoogleJsonWebSignature.ValidationSettings { Audience = new[] { $"{_configuration["Google:ClientId"]}" } });
            var email = payload.Email;
            
            var customer = await _customerService.GetCustomerByEmailAsync(email);
            if (customer == null)
            {
                return Ok(new { requiresAdditionalInfo = true, email = payload.Email });
            }
            var token = GenerateJwt(email);
            return Ok(new {Token = token});
        }
        catch (Exception ex)
        {
            Console.WriteLine(request.IdToken);
            return Unauthorized(new { Message = "Invalid Google token", Details = ex.Message });
        }
    }

    private string GenerateJwt(string email)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        var secretKey = _configuration["Jwt:SecretKey"];
        
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:MyDomainUrl"],
            //audience: "https://ashy-field-0c4ba1803.5.azurestaticapps.net",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromForm] CustomerRegistrationRequest customerData)
    {
        var customer = await _customerService.GetCustomerByEmailAsync(customerData.Email);
        if (customer != null)
        {
            return Ok();
        }

        Customer newCustomer = new Customer
        {
            FirstName = customerData.FirstName,
            LastName = customerData.LastName,
            Email = customerData.Email,
            Birthdate = customerData.Birthdate,
            Country = customerData.Country,
            City = customerData.City,
            Address = customerData.Address,
            LicenceIssuedDate = customerData.LicenceIssuedDate,
            CreatedAt = DateTime.Now
        };
        await _customerService.AddCustomerAsync(newCustomer);
        var token = GenerateJwt(customerData.Email);
        return Ok(new { Token = token });
    }
}
public record GoogleAuthRequest()
{
    public string IdToken { get; init; }
}

public record CustomerRegistrationRequest
{
    [Required] public DateTime Birthdate { get; init; }

    [EmailAddress] [Required] public string Email { get; init; }

    [Required] public string FirstName { get; init; }

    [Required] public string LastName { get; init; }

    [Required] public DateTime LicenceIssuedDate { get; set; }

    [Required] public string Country { get; init; }

    [Required] public string City { get; init; }

    [Required] public string Address { get; init; }
    
}