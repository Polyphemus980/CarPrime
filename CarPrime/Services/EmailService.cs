using CarPrime.Configurations;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
namespace CarPrime.Services;

public class EmailService : IEmailService
{
    private readonly string _apiKey;

    public EmailService(IOptions<SendGridSettings> options)
    {
        _apiKey = options.Value.ApiKey;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        var client = new SendGridClient(_apiKey);
        EmailAddress from = new EmailAddress("carprimemini@gmail.com", "Car Prime");
        EmailAddress to = new EmailAddress(toEmail);
        var email = MailHelper.CreateSingleEmail(from, to, subject, message, null);
        var response = await client.SendEmailAsync(email);
        
        if ((int)response.StatusCode > 400)
        {
            throw new Exception($"Failed to send email. Status code: ${(int)response.StatusCode}");
        }
    }
}