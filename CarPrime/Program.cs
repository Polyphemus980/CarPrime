using System.Text;
using CarPrime.Configurations;
using CarPrime.Data;
using CarPrime.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Cors config for allowing front end to make requests to this api
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", corsBuilder =>
            corsBuilder.AllowAnyOrigin()  // Allows all origins
                .AllowAnyHeader()  // Allows all headers
                .AllowAnyMethod()  // Allows all HTTP methods
    );
});

//Database config
var connectionString = Environment.GetEnvironmentVariable("SQLAZURECONNSTR_AZURE_SQL_CONNECTIONSTRING") 
                       ?? builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseAzureSql(connectionString));

//Email sender config
builder.Services.Configure<SendGridSettings>(builder.Configuration.GetSection("SendGrid"));
builder.Services.AddSingleton<IEmailService,EmailService>();

//BlobService
builder.Services.Configure<BlobSettings>(builder.Configuration.GetSection("Blob"));
builder.Services.AddSingleton<IBlobService, BlobService>();
//CustomerService
builder.Services.AddScoped<ICustomerService, CustomerService>();

//RentalService
builder.Services.AddScoped<IRentalService, RentalService>();

//CompaniesService
builder.Services.AddSingleton<CompaniesService, CompaniesService>();
 
//Google authentication config
var secretKey = builder.Configuration["Jwt:SecretKey"];
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:MyDomainUrl"],  
        ValidateAudience = false,
        //TODO: Validate audience once front-end is deployed
        //ValidateAudience = true, 
        //ValidAudience = configuration[front-end-url],   
        ValidateLifetime = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    await app.Services.GetRequiredService<ApplicationDbContext>().SeedDb();
}
app.Run();