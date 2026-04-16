using ChoreoCreator.Core.Services;
using ChoreoCreator.Core.ValueObjects;
using Xunit;

namespace ChoreoCreator.Tests;

public class UserRegistrationServiceTests
{
    [Fact]
    public async Task Register_ReturnsFailure_WhenUsernameInvalid()
    {
        var service = new UserRegistrationService(new StubPasswordHasher(), new StubUserCollection());
        var invalidUsername = (Username)typeof(Username)
            .GetConstructor(
                System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance,
                null,
                new[] { typeof(string) },
                null)!
            .Invoke(new object[] { "???" });

        var result = await service.Register(
            UserEmail.From("user@example.com"),
            invalidUsername,
            UserPassword.From("Password1!"),
            CancellationToken.None);

        Assert.True(result.IsFailure);
    }

    [Fact]
    public async Task Register_ReturnsFailure_WhenEmailAlreadyExists()
    {
        var userCollection = new StubUserCollection { Exists = true };
        var service = new UserRegistrationService(new StubPasswordHasher(), userCollection);

        var result = await service.Register(
            UserEmail.From("existing@example.com"),
            Username.From("existing_user"),
            UserPassword.From("Password1!"),
            CancellationToken.None);

        Assert.True(result.IsFailure);
    }

    [Fact]
    public async Task Register_ReturnsUser_WhenDataValid()
    {
        var passwordHasher = new StubPasswordHasher { HashResult = HashUserPassword.From("hashed") };
        var service = new UserRegistrationService(passwordHasher, new StubUserCollection());

        var result = await service.Register(
            UserEmail.From("new@example.com"),
            Username.From("new_user"),
            UserPassword.From("Password1!"),
            CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.Equal("new@example.com", result.Value.Email.Value);
        Assert.Equal("new_user", result.Value.Username.Value);
        Assert.Equal("hashed", result.Value.PasswordHash.Value);
    }
}
