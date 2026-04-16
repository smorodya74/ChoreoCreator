using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using ChoreoCreator.Application.Services;
using ChoreoCreator.Core.Models;
using ChoreoCreator.Core.Settings;
using ChoreoCreator.Core.ValueObjects;
using Microsoft.Extensions.Options;
using Xunit;

namespace ChoreoCreator.Tests;

public class JwtTokenServiceTests
{
    [Fact]
    public void GenerateToken_ContainsExpectedClaims()
    {
        var settings = Options.Create(new JwtSettings
        {
            SecretKey = "super-secret-key-for-tests-123456",
            Issuer = "test-issuer",
            Audience = "test-audience",
            ExpiresInMinutes = 30
        });
        var service = new JwtTokenService(settings);
        var user = User.Create(
            UserEmail.From("jwt-user@example.com"),
            Username.From("jwt_user"),
            HashUserPassword.From("hash"));

        var token = service.GenerateToken(user);

        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);
        Assert.Contains(jwt.Claims, x => x.Type == ClaimTypes.NameIdentifier && x.Value == user.Id.Value.ToString());
        Assert.Contains(jwt.Claims, x => x.Type == ClaimTypes.Email && x.Value == user.Email.Value);
        Assert.Contains(jwt.Claims, x => x.Type == ClaimTypes.Role && x.Value == user.Role);
    }
}
