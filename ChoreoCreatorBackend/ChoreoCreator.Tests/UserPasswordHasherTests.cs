using ChoreoCreator.Application.Services;
using ChoreoCreator.Core.ValueObjects;
using Xunit;

namespace ChoreoCreator.Tests;

public class UserPasswordHasherTests
{
    [Fact]
    public void HashPassword_AndVerify_SuccessPath()
    {
        var service = new UserPasswordHasher();
        var password = UserPassword.From("Password1!");

        var hash = service.HashPassword(password);
        var verifyResult = service.VerifyHashedPassword(hash, password);

        Assert.False(string.IsNullOrWhiteSpace(hash.Value));
        Assert.Equal(PasswordVerificationResult.Success, verifyResult);
    }

    [Fact]
    public void VerifyHashedPassword_ReturnsFailed_ForWrongPassword()
    {
        var service = new UserPasswordHasher();
        var hash = service.HashPassword(UserPassword.From("Password1!"));

        var verifyResult = service.VerifyHashedPassword(hash, UserPassword.From("Password2@"));

        Assert.Equal(PasswordVerificationResult.Failed, verifyResult);
    }
}
