using ChoreoCreator.Core.Services;
using ChoreoCreator.Core.Settings;
using ChoreoCreator.DataAccess;
using ChoreoCreator.DataAccess.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Text;
using ChoreoCreator.Application.Abstractions;
using ChoreoCreator.Application.Abstractions.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using ChoreoCreator.Application.Services;
using ChoreoCreator.Core.Contracts;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ChoreoCreatorDbContext>(
    options => 
    {
        options.UseNpgsql(builder.Configuration.GetConnectionString(nameof(ChoreoCreatorDbContext)));
    });

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));

var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>()!;
var key = Encoding.ASCII.GetBytes(jwtSettings.SecretKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidateAudience = true,
        ValidAudience = jwtSettings.Audience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };

    // Чтение JWT из cookie
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            context.Token = context.HttpContext.Request.Cookies["jwt_token"];
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<UserRegistrationService>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IUserPasswordHasher, UserPasswordHasher>();
builder.Services.AddScoped<IUserCollection, UserCollection>();
builder.Services.AddScoped<IScenariosServices, ScenariosServices>();
builder.Services.AddScoped<IScenariosRepository, ScenariosRepository>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
